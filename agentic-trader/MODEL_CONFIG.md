# Model Configuration Guide

The autonomous trading agent is **model agnostic** and supports OpenAI, Groq, and Cerebras models via LiteLLM.

## Supported Models

### Cerebras (RECOMMENDED FOR TRADING - Ultra-Fast)
- **Model**: `gpt-oss-120b` (120B parameter model)
- **Speed**: ⚡ **ULTRA-FAST** - 1800+ tokens/second
- **Pros**: Blazing fast inference (10x faster than OpenAI), excellent for real-time trading, 120B parameters for strong reasoning
- **Cons**: Newer provider, limited track record
- **Best for**: Real-time trading where speed is critical
- **API**: https://api.cerebras.ai/v1

### Groq (Fast & Cost-Effective)
- **Model**: `qwen/qwen3-32b` (Qwen 3, 32B parameters)
- **Speed**: ⚡ Fast - 200-500 tokens/second
- **Pros**: Very fast inference, cost-effective, strong multilingual support
- **Cons**: Smaller model size compared to others
- **Best for**: Development, testing, high-frequency decisions

### OpenAI (Default - High Quality)
- **Model**: `gpt-5-mini`
- **Speed**: 🐌 Slower - 50-100 tokens/second
- **Pros**: High quality, reliable, best reasoning
- **Cons**: Slower, higher cost per token
- **Best for**: Production trading with accurate decision-making where speed is less critical

## Configuration

### .env File Settings

Add these variables to your `.env` file:

```bash
# Model Provider: "cerebras" (recommended), "groq", or "openai" (default)
MODEL_PROVIDER=cerebras

# Cerebras API Key (required if using Cerebras)
CEREBRAS_API_KEY=csk-your-cerebras-api-key-here

# Groq API Key (required if using Groq)
GROQ_API_KEY=gsk-your-groq-api-key-here

# OpenAI API Key (required if using OpenAI)
OPENAI_API_KEY=sk-your-openai-api-key-here

# OpenAlgo Settings (always required)
OPENALGO_API_KEY=your-openalgo-key
OPENALGO_HOST=http://127.0.0.1:5000
```

## Switching Models

### Use Cerebras (Recommended for Speed)
1. Set `MODEL_PROVIDER=cerebras` in `.env`
2. Ensure `CEREBRAS_API_KEY` is configured
3. Run the agent:
   ```bash
   uv run python agent.py
   ```
4. You'll see: `[MODEL] Using Cerebras (cerebras/gpt-oss-120b) - ULTRA-FAST`

### Use Groq
1. Set `MODEL_PROVIDER=groq` in `.env`
2. Ensure `GROQ_API_KEY` is configured
3. Run the agent:
   ```bash
   uv run python agent.py
   ```
4. You'll see: `[MODEL] Using Groq (groq/qwen/qwen3-32b)`

### Use OpenAI (Default)
1. Set `MODEL_PROVIDER=openai` in `.env` (or leave it unset)
2. Ensure `OPENAI_API_KEY` is configured
3. Run the agent:
   ```bash
   uv run python agent.py
   ```
4. You'll see: `[MODEL] Using OpenAI (openai/gpt-5-mini)`

## Advanced: Custom Model Selection

You can override the default model for each provider:

```bash
# Use a different Cerebras model
MODEL_PROVIDER=cerebras
CEREBRAS_MODEL=cerebras/gpt-oss-120b  # Default, or try cerebras/llama3.1-70b
CEREBRAS_API_KEY=csk-...

# Use a different Groq model
MODEL_PROVIDER=groq
GROQ_MODEL=groq/qwen/qwen3-32b  # Default, or try groq/llama-3.3-70b-versatile
GROQ_API_KEY=gsk-...

# Use a different OpenAI model
MODEL_PROVIDER=openai
OPENAI_MODEL=openai/gpt-4o
OPENAI_API_KEY=sk-...

# Use any custom LiteLLM-compatible model
MODEL_PROVIDER=custom
CUSTOM_MODEL=anthropic/claude-3-5-sonnet-20241022
CUSTOM_API_KEY=sk-ant-...
CUSTOM_API_BASE=https://api.anthropic.com/v1  # Optional
```

## Model Selection Logic

The agent automatically selects the model based on `MODEL_PROVIDER`:

```python
# From agent.py:36-56
MODEL_PROVIDER = os.getenv("MODEL_PROVIDER", "openai").lower()

if MODEL_PROVIDER == "groq":
    trading_model = LitellmModel(
        model="groq/llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY")
    )
else:
    trading_model = LitellmModel(
        model="openai/gpt-5-mini",
        api_key=os.getenv("OPENAI_API_KEY")
    )
```

## Adding Custom Models

To add support for other LiteLLM-compatible models:

1. Edit `agent.py` lines 36-56
2. Add a new condition for your provider:
   ```python
   elif MODEL_PROVIDER == "anthropic":
       trading_model = LitellmModel(
           model="anthropic/claude-3-5-sonnet-20241022",
           api_key=os.getenv("ANTHROPIC_API_KEY")
       )
   ```
3. Update this documentation

## Performance Comparison

| Metric | Cerebras gpt-oss-120b | Groq qwen3-32b | OpenAI gpt-5-mini |
|--------|----------------------|----------------|-------------------|
| Model Size | 120B parameters | 32B parameters | Unknown (mini) |
| Speed | ⚡⚡⚡ ~50ms/request | ⚡⚡ ~100ms/request | 🐌 ~500ms/request |
| Tokens/sec | 1800+ | 200-500 | 50-100 |
| Cost | $0.60/1M in + $0.60/1M out | $0.05/1M tokens | $0.15/1M in + $0.60/1M out |
| Quality | Excellent (120B) | Very Good (32B) | Excellent |
| Reasoning | Best-in-class | Strong | Best-in-class |
| Availability | 99% uptime | 99% uptime | 99.9% uptime |
| **Best For** | **Real-time trading** | Fast decisions | Accuracy critical |

## Troubleshooting

### Import Error
```
ModuleNotFoundError: No module named 'agents.extensions.models.litellm_model'
```
**Fix**: Install with LiteLLM support:
```bash
uv add openai-agents[litellm]
uv sync
```

### API Key Error
```
litellm.AuthenticationError: API key not found
```
**Fix**: Ensure the correct API key is set in `.env`:
- For OpenAI: `OPENAI_API_KEY=sk-...`
- For Groq: `GROQ_API_KEY=gsk-...`

### Model Not Found
```
litellm.exceptions.BadRequestError: model 'gpt-5-mini' not found
```
**Fix**: Check that the model name is correct and available. If the model name changes, update `agent.py` line 53.

## Cost Estimation

### Daily Trading Costs (Estimated)

**Assumptions**:
- 375 trading cycles per day (9:15 AM - 3:15 PM, every minute)
- 5 symbols per cycle
- ~2000 tokens per cycle (analysis + decisions)
- Total: 750,000 tokens/day

**OpenAI (gpt-5-mini)**:
- Cost: ~$0.11/day (~$3.30/month)

**Groq (llama-3.3-70b)**:
- Cost: ~$0.04/day (~$1.20/month)

*Note: Actual costs may vary based on market conditions and decision complexity.*
