# 领域文档 [Domain Docs]

本仓库使用单上下文 [Single-context] 领域文档布局 [Domain Documentation Layout]。

## 探索前读取 [Read Before Exploring]

- 根目录 `CONTEXT.md`：项目词汇表 [Project Glossary]
- `docs/adr/`：架构决策记录 [Architecture Decision Records]

如果这些文件不存在，静默继续 [Proceed Silently]。生产技能 [Producer Skill] 会在术语 [Terms] 或决策 [Decisions] 被确认后按需创建它们。

## 文件结构 [File Structure]

```text
/
├── CONTEXT.md
├── docs/
│   └── adr/
└── src/
```

## 使用词汇表语言 [Use Glossary Vocabulary]

当输出中命名领域概念 [Domain Concepts] 时，优先使用 `CONTEXT.md` 中定义的术语 [Terms]。如果需要的概念尚未定义，说明可能存在语言漂移 [Language Drift] 或真实缺口 [Real Gap]，应在 `/grill-with-docs` 中澄清。

## 标出 ADR 冲突 [Flag ADR Conflicts]

如果输出与现有 ADR [Architecture Decision Record] 冲突，必须明确指出冲突，而不是静默覆盖。
