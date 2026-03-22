import type { 
  IRequestAnalyzer, 
  RequestData, 
  AnalysisResult, 
  WorkflowType, 
  ExpertiseArea,
  RequestId,
  CommandType 
} from './types';

export class RequestAnalyzer implements IRequestAnalyzer {
  private readonly expertiseKeywords: Map<ExpertiseArea, RegExp[]> = new Map([
    ['backend', [
      /api|server|database|backend|service|endpoint/i,
      /payment|processing|authentication|auth/i,
      /sql|mongodb|redis|cache/i
    ]],
    ['frontend', [
      /ui|interface|component|frontend|react|vue|angular/i,
      /button|menu|navigation|responsive|css|styling/i,
      /animation|transition|interaction/i
    ]],
    ['design', [
      /design|ui|ux|layout|visual|mockup|wireframe/i,
      /theme|color|typography|spacing|branding/i,
      /user experience|usability|accessibility/i
    ]],
    ['qa', [
      /test|testing|bug|error|validation|quality/i,
      /verify|check|ensure|validate|coverage/i
    ]],
    ['devops', [
      /deploy|deployment|ci|cd|pipeline|build/i,
      /docker|kubernetes|aws|gcp|azure|cloud/i,
      /infrastructure|monitoring|logging/i
    ]],
    ['security', [
      /security|vulnerability|injection|xss|csrf/i,
      /authentication|authorization|permission|access/i,
      /encryption|ssl|https|secure/i
    ]]
  ]);

  async analyze(request: RequestData): Promise<AnalysisResult> {
    const requestId = this.generateRequestId(request);
    const commandType = this.extractCommandType(request.command);
    const intent = this.extractIntent(request.command, commandType);
    const expertiseAreas = this.identifyExpertiseAreas(request.command, request.context);
    const complexity = this.calculateComplexity(request.command, expertiseAreas);
    const workflowType = this.classifyWorkflow(commandType, complexity, request.user_preferences);
    const estimatedTime = this.estimateTime(workflowType, complexity);
    const requirements = this.extractRequirements(request.command);

    return {
      request_id: requestId,
      command_type: commandType,
      workflow_type: workflowType,
      expertise_areas: expertiseAreas,
      complexity_level: complexity,
      estimated_time: estimatedTime,
      intent: intent,
      requirements: requirements
    };
  }

  private generateRequestId(request: RequestData): RequestId {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, -5);
    const command = request.command.toLowerCase().split(' ')[0].replace('/', '');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${request.timestamp.slice(0, 10)}-${timestamp}-${command}-${randomSuffix}` as RequestId;
  }

  private extractCommandType(command: string): CommandType {
    const cleanCommand = command.toLowerCase().replace('/', '');
    if (cleanCommand.startsWith('fix-bug')) return 'fix-bug';
    if (cleanCommand.startsWith('build-mvp')) return 'build-mvp';
    if (cleanCommand.startsWith('validate')) return 'validate';
    if (cleanCommand.startsWith('ultrathink')) return 'ultrathink';
    return 'fix-bug'; // Default fallback
  }

  private extractIntent(command: string, commandType: CommandType): string {
    const description = command.replace(/^\/?\w+[-\w]*\s*/, '').trim();
    
    switch (commandType) {
      case 'fix-bug':
        return `fix ${description.replace(/\s+/g, ' ')}`;
      case 'build-mvp':
        return `implement ${description.replace(/\s+/g, ' ')}`;
      case 'validate':
        return `validate ${description.replace(/\s+/g, ' ')}`;
      case 'ultrathink':
        return `architect and implement ${description.replace(/\s+/g, ' ')}`;
      default:
        return description;
    }
  }

  private identifyExpertiseAreas(command: string, context: any): ReadonlyArray<ExpertiseArea> {
    const areas: Set<ExpertiseArea> = new Set();
    const fullText = `${command} ${context.recent_changes?.join(' ') || ''}`;

    for (const [area, patterns] of this.expertiseKeywords) {
      for (const pattern of patterns) {
        if (pattern.test(fullText)) {
          areas.add(area);
          break; // One match per area is enough
        }
      }
    }

    // Always include QA for bug fixes and validation for MVPs
    const commandType = this.extractCommandType(command);
    if (commandType === 'fix-bug' && !areas.has('qa')) {
      areas.add('qa');
    }
    if (commandType === 'build-mvp' && !areas.has('qa')) {
      areas.add('qa');
    }

    return Array.from(areas);
  }

  private calculateComplexity(command: string, expertiseAreas: ReadonlyArray<ExpertiseArea>): number {
    let complexity = 1;

    // Base complexity from number of expertise areas
    complexity += expertiseAreas.length;

    // Keyword-based complexity increase
    const complexityKeywords = [
      { pattern: /architecture|redesign|refactor|scale/i, points: 3 },
      { pattern: /security|vulnerability|injection/i, points: 3 },
      { pattern: /real[- ]?time|websocket|streaming/i, points: 2 },
      { pattern: /integration|api|database/i, points: 2 },
      { pattern: /responsive|animation|complex/i, points: 1 },
      { pattern: /microservices|distributed/i, points: 4 }
    ];

    for (const { pattern, points } of complexityKeywords) {
      if (pattern.test(command)) {
        complexity += points;
      }
    }

    // Simple fixes get lower complexity
    if (/typo|text|button text|simple|quick/i.test(command)) {
      complexity = Math.max(1, complexity - 2);
    }

    return Math.min(10, Math.max(1, complexity));
  }

  private classifyWorkflow(
    commandType: CommandType, 
    complexity: number,
    userPreferences: any
  ): WorkflowType {
    // User preference override
    if (userPreferences.preferred_speed === 'complex') {
      return 'complex';
    }

    // Ultrathink is always complex
    if (commandType === 'ultrathink') {
      return 'complex';
    }

    // Complexity-based classification
    if (complexity >= 8) return 'complex';
    if (complexity >= 4) return 'standard';
    return 'rapid_response';
  }

  private estimateTime(workflowType: WorkflowType, complexity: number): string {
    switch (workflowType) {
      case 'rapid_response':
        return complexity <= 2 ? '5-10 minutes' : '10-15 minutes';
      case 'standard':
        return complexity <= 5 ? '2-3 hours' : '3-4 hours';
      case 'complex':
        return complexity >= 9 ? '2-3 days' : '1 day';
      default:
        return '15 minutes';
    }
  }

  private extractRequirements(command: string): ReadonlyArray<string> {
    const requirements: string[] = [];
    const description = command.replace(/^\/?\w+[-\w]*\s*/, '').trim();

    // Extract specific features mentioned
    const featurePatterns = [
      { pattern: /real[- ]?time\s+(\w+)/i, requirement: 'real-time $1 functionality' },
      { pattern: /file\s+sharing/i, requirement: 'file upload and sharing' },
      { pattern: /emoji\s+support/i, requirement: 'emoji picker integration' },
      { pattern: /dark\s+mode/i, requirement: 'dark theme implementation' },
      { pattern: /responsive/i, requirement: 'mobile-responsive design' },
      { pattern: /animation/i, requirement: 'smooth animations and transitions' },
      { pattern: /authentication|auth|login/i, requirement: 'user authentication system' },
      { pattern: /payment/i, requirement: 'payment processing functionality' },
      { pattern: /dashboard/i, requirement: 'dashboard interface with data visualization' },
      { pattern: /chat/i, requirement: 'real-time messaging functionality' }
    ];

    for (const { pattern, requirement } of featurePatterns) {
      const match = description.match(pattern);
      if (match) {
        requirements.push(requirement.replace('$1', match[1] || ''));
      }
    }

    // Default requirements if none found
    if (requirements.length === 0) {
      const commandType = this.extractCommandType(command);
      switch (commandType) {
        case 'fix-bug':
          requirements.push('identify and resolve the reported issue');
          break;
        case 'build-mvp':
          requirements.push('implement core functionality');
          requirements.push('ensure basic user experience');
          break;
        case 'validate':
          requirements.push('conduct user research and validation');
          break;
        case 'ultrathink':
          requirements.push('comprehensive architecture design');
          requirements.push('scalable implementation strategy');
          break;
      }
    }

    return requirements;
  }
}