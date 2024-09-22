// todo: receive the prediction result and process
// steps:
//     1. get the prediction req ReportBody
//     2. get the image compress using sharp
//     3. send to r2 and store the url in db both in user.images array and the images model
//     3.5 also yk store the image sizes and update the storageUsed info, lol forgot this
//     4. revalidate the studio and settings path
//     5. mutate image credits increase usedImages + 1
//     6. get the userId from images model array and then store the imageid and url in the array
//     7. anything else?
//     8. firt make sure the request is from replicate secure this webhook endpoint, but how? let's see
//     9.[IMPORTANT] after done with basic image generation send the image then to the clarity upscaler
