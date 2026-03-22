# Javascript Style Guide
# TypeScript Style Guide

> Scope: Primary code style for Node services (NestJS), Next.js (App Router), React Native, and shared packages. Applies to monorepos (pnpm/turbo) and single repos.

## Compiler & Project Setup

* **`strict: true`** (enables `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess`).
* Use **ESM** output; set `"module": "esnext"`, `"moduleResolution": "bundler"` (or `node16` if required).
* Consider `"target": "ES2022"`+ and `"verbatimModuleSyntax": true` for modern bundlers.
* **Path aliases** via `baseUrl` + `paths`. Keep shallow (≤2 segments). Mirror in bundlers and each package tsconfig.
* **Type‑only imports:** `import type { Foo } from '…'` to avoid runtime edges.
* **Emit**: libraries emit types (`declaration: true`), apps do not.

## Types vs Interfaces

* Prefer **`type`** for most shapes and unions; use **`interface`** when you need declaration merging or classes to implement.
* Avoid `enum`; use **union literals** or **as const objects** + `keyof typeof`.

## Immutability & Readonly

* Favor `readonly` fields, `ReadonlyArray<T>`, and `as const` for config.
* Pass objects immutably; avoid mutating params.

## Errors & Result Types

* Never throw strings. Create small **error classes** (e.g., `DomainError`) with fields, or use `Result<T, E>` patterns.
* Public APIs should return **typed results**; avoid `any` in signatures. Use `unknown` at boundaries and **narrow**.

## Narrowing & Guards

* Write **type guards** for common unions: `function isUser(x: unknown): x is User { … }`.
* Prefer safe narrowing (`in`, `typeof`, `Array.isArray`). Avoid `as` unless narrowing is provably correct.

## Generics

* Name meaningfully (`TItem`, `TError` over `T`, `E` where clarity matters).
* Constrain with `extends`; use defaults when ergonomic: `<T extends object = Record<string, unknown>>`.

## React / Next.js

* Components: `PascalCase.tsx`, **named exports** only.
* Props: `type Props = { … }`; don’t use `React.FC` for implicit `children`.
* Server/Client:

  * Add `'use client'` only when needed.
  * Type **Server Actions** inputs/outputs and validate with zod at the edge.
* Hooks: type params/returns explicitly; return stable shapes.

## NestJS

* DTOs: classes with **class‑validator** decorators; export the **TypeScript type** of the DTO too when consumed elsewhere.
* Controllers/Providers: explicit return types; avoid `any`. Throw **HTTP exceptions** (typed) or map domain errors.
* Injection tokens: centralize string tokens and type them.

## Data & IO

* Database access: use typed client (Prisma/TypeORM). Mirror DB schema types to domain types with adapters.
* External APIs: define **typed clients** and **response codecs** (zod/valibot) to validate and narrow.
* Env: model with a schema `Env` and validate at startup.

## File & Export Conventions

* One module = one responsibility. Avoid huge “kitchen‑sink” files.
* **Named exports**; avoid default exports (clean refactors, better tooling).
* Package entrypoints expose **public API** only; keep internals private.

## Testing (Vitest/Jest + Playwright)

* Unit: colocate `*.test.ts`; avoid testing implementation details.
* Integration/API: `*.spec.ts` with real boundaries or thin fakes.
* E2E (optional): Playwright in `e2e/`; use `data-testid` selectors.
* Use TS in tests; never `any`. Add helpers with generics for fixtures/builders.

## Linting & Formatting

* ESLint with `@typescript-eslint` (strict). Ban implicit any, empty interfaces, useless `as`.
* Prettier mandatory; align with ESLint via `eslint-config-prettier`.

## Utility Types & Patterns

* Prefer **mapped types** (`Partial<T>`, `Pick<T>`, `Omit<T>`, `Readonly<T>`).
* Use `ReturnType<typeof fn>` and `Awaited<PromiseLike<T>>` where helpful.
* Branded/opaque types for IDs: `type UserId = string & { readonly brand: 'UserId' }`.

## Examples

**Type‑only import & union result**

```ts
import type { User } from '@/domain/user'

type Result<T> = { ok: true; value: T } | { ok: false; error: Error }

export function getUserName(u: User): string {
  return `${u.firstName} ${u.lastName}`.trim()
}
```

**Guard + narrowing**

```ts
export type Payload = { kind: 'email'; value: string } | { kind: 'sms'; value: string }

export const isEmail = (p: Payload): p is Extract<Payload, { kind: 'email' }> => p.kind === 'email'

export function send(p: Payload) {
  if (isEmail(p)) return sendEmail(p.value)
  return sendSms(p.value)
}
```

**React props + server action types**

```ts
export type ButtonProps = { onClick?: () => void; children: React.ReactNode }
export function Button({ onClick, children }: ButtonProps) { /* … */ }

export type CreateUserInput = { email: string; name: string }
export type CreateUserOutput = { id: string }
export async function createUserAction(input: CreateUserInput): Promise<CreateUserOutput> { /* … */ }
```

**NestJS DTO + controller**

```ts
import { IsEmail, IsString } from 'class-validator'
export class CreateUserDto { @IsEmail() email!: string; @IsString() name!: string }
export type CreateUser = { email: string; name: string }

@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}
  @Post()
  create(@Body() dto: CreateUserDto): Promise<User> { return this.svc.create(dto) }
}
```

## Don’ts

* Don’t use `any` as an escape hatch; prefer `unknown` + narrowing.
* Don’t export untyped JSON blobs; define schemas and inferred types.
* Don’t rely on ambient/implicit types from libraries; import and re‑export types explicitly where needed.
If you want, I can also add a two-line note in `code-style.md` explaining: “Use **TypeScript** by default; fall back to **JavaScript** only for scripts, spikes, or where TS ergonomics are poor.”
