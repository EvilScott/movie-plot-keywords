#!/usr/bin/env bash
pg_restore -U plots -d plots --clean -v /docker-entrypoint-initdb.d/plots.dump
psql -U plots plots -c "VACUUM ANALYZE"
