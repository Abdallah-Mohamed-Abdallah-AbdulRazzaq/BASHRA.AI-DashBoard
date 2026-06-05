# Postman and SQL Files Index

## 1. File naming convention

Most batch ZIPs contain:

```text
01-*-api-docs.md
02-*-manual-testing.md
03-*-sql-verification.sql
04-*-postman-collection.json
05-*-test-matrix.csv
```

Some early/admin batches may have slightly different numbering. The ZIP packages are preserved as originally generated.

## 2. Batch ZIP inventory

Use `08-BATCH_INVENTORY.csv` for a machine-readable list.

## 3. Recommended Postman import order

```text
Admin batch collections
Doctor batch collections
Patient batch collections
AI Dermatology collections
Cross-security collections
```

## 4. Recommended SQL execution order

For each batch:

```text
1. Run baseline SELECT queries before API tests.
2. Run the API request in Postman.
3. Re-run verification SELECT queries.
4. Compare counters/status/ownership/created rows.
5. Capture deviations.
```

## 5. Cross-security SQL focus

Security regression SQL should be run before and after negative tests for:

```text
addresses
appointments
medical_records
prescriptions
ratings
conversation_participants
messages
ai_sessions
ai_session_messages
ai_session_files
ai_analysis_results
ai_result_shares
ai_usage_counters
ai_usage_events
files.access_count
admin_logs
auth_tokens
blocked_entities
```

## 6. ZIP packages included

All generated ZIP packages are copied under:

```text
all-batch-zips/
```

Use this folder as the final transferable archive set.
