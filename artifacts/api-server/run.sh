#!/usr/bin/env bash
set -e

export ROCKET_ADDRESS=0.0.0.0
export ROCKET_PORT=${PORT:-8080}
export ROCKET_LOG_LEVEL=normal

cd /home/runner/workspace/artifacts/api-server
exec cargo run 2>&1
