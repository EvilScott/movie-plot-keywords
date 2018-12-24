#!/usr/bin/env bash
pg_restore -U plots -d plots --clean -v /docker-entrypoint-initdb.d/plots.dump
