# AI-AUTONOMY-CLASSIFIER-GATE-EVALUATOR-NON-AUTHORIZATION-1

この実装は評価ロジックだけを提供する。

`autonomyEligible=true` は GitHub operation の実行権限ではない。

次の操作は、この実装またはその出力だけでは認可されない。

- Ready for review
- Merge
- Deploy
- App Catalog mutation
- SharePoint write / schema mutation
- LIVE WRITE / LIVE CREATE
- Production Binding
- M365 / Entra mutation

L1 auto Ready / auto Merge は将来候補であり、現時点では未認可である。
