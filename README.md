## TODO list:

- IMPORTANT: change logo and branding on stripe account
- how to handle monthly limits when user buys yearly plan, cauz maybe if no invoice.paid monthly events ig,
- email user's when abandoned cart (does stripe does that itself or will it need it's own cron job?)
- have transactional and marketing emails flow
- research and development on ai models for best interior images, testing and setup on runpod.io (later)
- do more research about this in comfyui workflows, which controlnet or Lora?
- also add the privacy-policy and the tos
- prompt suggest feature (ok maybe if needed)
- maybe add watermark implementation for images in personal plan tier
- now's just empty rooms or redesign rooms, add sketch to result too with advance comfyui workflow on runpod.io
- user can download image and delete them, cause the max stoage limits liek 1,5,25gbs

- for security implement rate limiting later on with upstash/redis (not like it happens everyday)
- and send the user to 429 page with into about what happened and wait a miute and then try logging
