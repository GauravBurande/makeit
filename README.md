## TODO list:

- IMPORTANT: setup a mongodb for makeit
- email user's when abandoned cart (does stripe does that itself or will it need it's own cron job?)
- have transactional and marketing emails flow
- research and development on ai models for best interior images, testing and setup on runpod.io (later)
- do more research about this in comfyui workflows, which controlnet or Lora?
- implement webhook(for stripe and mailgun), checkout(both server-api and client logic)
- gpu server connection after prediction request, webhook or polling
- image size controlling, compressing them using sharp
- also add the privacy-policy and the tos
- setup cloudflare r2 get envs and setup stripe too get envs
- update root level env.ts file after getting these above for type safety
- prompt suggest feature (ok maybe if needed)
- store images in r2 after prediction complete by compressing using sharp
- also compress before sending to the ai model on runpod in the api
- maybe add watermark implementation for images in personal plan tier
- now's just empty rooms or redesign rooms, add sketch to result too with advance comfyui workflow on runpod.io
- just one concurrent prediction rn, more like 3-4 after done with mvp
- user can download image and delete them, cause the max stoage limits liek 1,5,25gbs
- configure images layout(16:9 or 9:16) for images shown in the gallery for user generated images
- or handle the ui such both layout type images can be shown in one

- for security implement rate limiting later on with upstash/redis (not like it happens everyday)
- and send the user to 429 page with into about what happened and wait a miute and then try logging
