# Installation and Setup #
npm install @imagekit/next

# Uploading Files#

Upload Flow Overview
Here’s how the upload process using the SDK works:

__1.Client Request for Auth Parameters__ 
  The client component calls an API route to fetch the authentication parameters.
  You can implement your own application logic within this route to authenticate the user.
  After that, use getUploadAuthParams to generate the upload credentials

   ` Refer to  app\api\imagekit-auth\route.ts`
             
             "and obv env "

__2.File Upload__
  Once the client has the auth parameters, it can call the .upload function with the necessary   data.             


   ` Refer to app\api\video\route.ts`      here we are basically storing(POST) and fetching(GET) the videos

