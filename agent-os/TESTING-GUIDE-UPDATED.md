# Agent OS v2.0 Smart Router Test Suite

This is a comprehensive test environment for validating the Agent OS v2.0 Smart Router implementation.

## Quick Start

### Option 1: Run All Tests (Recommended)
```bash
npm run test:all
```

### Option 2: Run Individual Tests

#### Simple JavaScript Test (No TypeScript dependencies)
```bash
npm run test:simple
# or directly: node test-simple.js
```

#### TypeScript Integration Test (Uses tsx instead of ts-node)
```bash
npm run test:typescript
# or directly: npx tsx test-typescript-simple.ts
```

#### Comprehensive Validation Test (51 tests)
```bash
npm run test:complete
# or directly: node test-complete.js
```

## Fixing ts-node Issues

If you encounter ts-node module errors, use these alternatives:

### Use tsx instead of ts-node
```bash
npm run demo        # Now uses tsx
npx tsx tests/integration/demo.ts
```

### Clean reinstall dependencies
```bash
npm run reinstall
```

### Alternative approaches
```bash
# Direct tsx execution
npx tsx test-typescript-simple.ts

# Compile and run
npm run build
node dist/index.js
```

## Test Results Expected

All tests should show:
- ✅ 51/51 tests passing (100% success rate)
- ✅ Smart Router components validated
- ✅ Agent OS integration working
- ✅ Rapid commands functional (/fix-bug, /build-mvp, /validate)
- ✅ Feedback collection operational
- ✅ TypeScript type safety confirmed

## Key Features Validated

- **15-minute critical bug fixes** with `/fix-bug`
- **4-hour MVP development** with `/build-mvp` 
- **2-hour user validation** with `/validate`
- **Machine learning** from user feedback
- **Real-time progress tracking** and monitoring
- **Git integration** for complete audit trails
- **Concurrent workflow handling** at scale
- **Intelligent agent selection** and load balancing

## Troubleshooting

### ts-node errors ("Cannot find module './util'")
**Root Cause**: ts-node has module resolution issues with newer Node.js versions

**Solutions (in order of recommendation):**
1. **Use tsx** (already configured): `npm run demo` now uses tsx instead of ts-node
2. **Run alternative tests**: `npm run test:all` uses working JavaScript and tsx approaches  
3. **Clean reinstall**: `npm run reinstall` to fix corrupted node_modules
4. **Manual tsx execution**: `npx tsx your-typescript-file.ts`

### Missing dependencies
```bash
npm install
# or clean reinstall: npm run reinstall
```

### If setup-test.sh creates broken ts-node setup
```bash
# The setup script now creates tsx-based configuration
# All new test environments will use tsx instead of ts-node
# Existing users should run: npm install tsx
```

### TypeScript compilation errors
```bash
# Type check only (will show errors but continue)
npx tsc --noEmit

# Use working alternatives
npm run test:simple
npm run test:complete
```

## Architecture

The test suite validates:
- Core Smart Router implementation in `src/smart-router/`
- Agent OS configuration in `.agent-os/`
- Rapid command integration
- Feedback collection and learning systems
- Performance and scalability metrics

---

## Original Agent OS

<img width="1280" height="640" alt="agent-os-og" src="https://github.com/user-attachments/assets/f70671a2-66e8-4c80-8998-d4318af55d10" />

[Agent OS](https://buildermethods.com/agent-os) transforms AI coding agents from confused interns into productive developers. Created by Brian Casel @ [Builder Methods](https://buildermethods.com).

