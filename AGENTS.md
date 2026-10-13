# AGENTS.md

## Intégration SasPay

- Utilisez la documentation officielle SasPay : `https://docs.saspay.me/llms.txt` et la spécification OpenAPI `https://docs.saspay.me/api-reference/openapi.json`.
- Base URL autorisée : `https://api.saspay.me/api/v1`.
- Toutes les requêtes SasPay doivent être faites depuis le backend uniquement.
- La clé API est `Authorization: Bearer sk_test_...` en dev et `sk_live_...` en prod.
- Ne jamais exposer `SASPAY_API_KEY` ni `SASPAY_WEBHOOK_SECRET` dans le frontend, les logs, les composants React, ni dans les variables `NEXT_PUBLIC_*`.
- Les montants doivent être des chaînes décimales, par exemple `"5000.00"`, jamais des floats JavaScript.
- Pour `/checkout-sessions/`, utilisez le endpoint officiel exact. Ne pas inventer de champ supplémentaire absent du OpenAPI.
- Les webhooks doivent être vérifiés sur le corps brut avec `X-Webhook-Signature` et `X-Webhook-Timestamp` ; rejetez les horodatages trop anciens (tolérance 300s).
- Une clé d’idempotence est recommandée sur les endpoints qui déplacent de l’argent ; pour `/checkout-sessions/`, la doc précise qu’elle n’est pas prise en charge.
- Ne livrez l’accès Pro qu’après vérification du statut confirmé côté SasPay. En cas de `PENDING`, l’accès doit rester refusé.
- L’application doit ignorer les webhooks dupliqués et mettre à jour le statut local de façon idempotente.
- N’inventez aucun endpoint, champ, statut ou événement absent de la spécification OpenAPI.
