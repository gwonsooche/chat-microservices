#!/bin/bash
#
# This script builds a docker image for the chat server and uploads (pushes)
# the created image to the image hub (Docker Hub). That is, it is responsible
# for the whole build process of the server.

docker build -t chat-server .
docker image tag chat-server gwonsooche/chat-server:latest
# TODO: Handle the case of push failure (e.g., "net/http: TLS handshake
# timeout").
docker image push gwonsooche/chat-server:latest