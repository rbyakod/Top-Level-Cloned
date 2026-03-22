import type { CommandType, ICommandParser, ParseResult } from './types';
import { ParseError } from './types';

export class CommandParser implements ICommandParser {
  private readonly commandPatterns: Map<CommandType, RegExp> = new Map([
    ['fix-bug', /^\/?fix[-_]?bug\s+(.+)/i],
    ['build-mvp', /^\/?build[-_]?mvp\s+(.+)/i],
    ['validate', /^\/?validate\s+(.+)/i],
    ['ultrathink', /^\/?ultrathink\s+(.+)/i],
  ]);

  parse(command: string): ParseResult<CommandType> {
    // Validate input
    if (!command || command.trim().length === 0) {
      return {
        success: false,
        error: new ParseError('Empty command provided')
      };
    }

    const trimmedCommand = command.trim();

    // Try to match each command pattern
    for (const [commandType, pattern] of this.commandPatterns) {
      const match = trimmedCommand.match(pattern);
      if (match && match[1] && match[1].trim().length > 0) {
        return {
          success: true,
          data: commandType
        };
      }
    }

    // Check if command matches pattern but lacks description
    const commandOnlyPatterns = [
      /^\/?fix[-_]?bug\s*$/i,
      /^\/?build[-_]?mvp\s*$/i,
      /^\/?validate\s*$/i,
      /^\/?ultrathink\s*$/i,
    ];

    for (const pattern of commandOnlyPatterns) {
      if (trimmedCommand.match(pattern)) {
        return {
          success: false,
          error: new ParseError('Command requires description')
        };
      }
    }

    return {
      success: false,
      error: new ParseError(`Unknown command: ${trimmedCommand.split(' ')[0]}`)
    };
  }
}