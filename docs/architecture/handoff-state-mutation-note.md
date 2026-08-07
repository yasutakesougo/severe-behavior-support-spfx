# Handoff mutation history boundary

戻り遷移の実行者・実行時刻は `HandoffState` に追加しない。

現在状態から消える後続フィールドの履歴は、後続の AuditEvent 契約で扱う。

本PRでは履歴テーブル、AuditEvent、永続化を実装しない。
