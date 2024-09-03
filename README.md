## TODO list:

- email user's when abandoned cart (does stripe does that itself or will it need it's own cron job?)
- have transactional and marketing emails flow
- research and development on ai models for best interior images, testing and setup on runpod.io (later)
- do more research about this in comfyui workflows, which controlnet or Lora?
- for ui stuff - studio page with form, billing page, usage, account page, etc... settings, lol!
- logout and delete for user avatar popup, when clicked close the popup
- the flow is first signin page if not signed in and then pricing section
- implement webhook(for stripe and mailgun), checkout(both server-api and client logic)
- constant file for interior form elements like type of room, style, material, colors, etc...
- gpu server connection after prediction request, webhook or polling
- image size controlling, compressing them using sharp
- fetch user info in the studio from server component
- also add the privacy-policy and the tos
- setup cloudflare r2 get envs and setup stripe too get envs
- update root level env.ts file after getting these above for type safety
- prompt suggest feature
- get the form component done with all the types constant configured for the form elements.
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
