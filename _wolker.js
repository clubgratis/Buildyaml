name: Build CF Worker
on:
  workflow_dispatch:
    inputs:
      WORKER_NAME:
        description: "ovh"
        required: true
        type: string
      DOMAIN_NAME:
        description: "ovh.aquavless.filegear-sg.me"
        required: true
        type: string
      UUID:
        description: "autogenerate"
        required: false
        type: string
        default: auto
      PROXYIP:
        description: "51.79.254.182"
        required: true
        type: string
jobs:
    build:
        name: Build
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - name: Proccess variable
            run: |
              WORKER_NAME=${{ github.event.inputs.WORKER_NAME }}
              echo "[+] WORKER_NAME: ${WORKER_NAME}"
              sed -i "s/%worker_name%/${WORKER_NAME}/g" ./wrangler.toml
              DOMAIN_NAME=${{ github.event.inputs.DOMAIN_NAME }}
              SUBDOMAIN="${WORKER_NAME}.${DOMAIN_NAME}"
              echo "[+] SUBDOMAIN: ${SUBDOMAIN}"
              sed -i "s/%subdomain_name%/${SUBDOMAIN}/g" ./wrangler.toml
              UUID=${{ github.event.inputs.UUID }}
              [[ "${UUID}" == "auto" ]] && UUID=$(uuidgen -r)
              echo "[+] UUID: ${UUID}"
              sed -i "s/%uuid%/${UUID}/g" ./wrangler.toml
              PROXYIP=${{ github.event.inputs.PROXYIP }}
              echo "[+] PROXYIP: ${PROXYIP}"
              sed -i "s/%proxyip%/${PROXYIP}/g" ./wrangler.toml
          - name: Deploy app
            uses: cloudflare/wrangler-action@v3
            with:
              apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
              accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
