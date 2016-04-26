Simply run meteor to start the project

1) S3 library
https://atmospherejs.com/lepozepo/s3


    1. Create an S3 bucket in your preferred region.
    2. Access Key Id and Secret Key
    Navigate to your bucket
    On the top right side you'll see your account name. Click it and go to Security Credentials.
    Create a new access key under the Access Keys (Access Key ID and Secret Access Key) tab.
    Enter this information into your app as defined in "How to Use" "Step 1".
    Your region can be found under "Properties" button and "Static Website Hosting" tab.
    bucketName.s3-website-eu-west-1.amazonaws.com.
    If your region is "us-east-1" or "us-standard" then you don't need to specify this in the config.
    3. Hosting
    Go back to your bucket and select the "Properties" OF THE BUCKET, not a file.
    Go to the "Static Website Hosting" tab.
    Upload a blank index.html file and write it's path in the textfield.
    Enable website hosting.
    Click "Save"
    4. CORS
    You need to set permissions so that everyone can see what's in there.

    In the "Properties" go to the "Permissions" tab.

    Click "Edit CORS Configuration" and paste this:

    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <CORSRule>
            <AllowedOrigin>*</AllowedOrigin>
            <AllowedMethod>PUT</AllowedMethod>
            <AllowedMethod>POST</AllowedMethod>
            <AllowedMethod>GET</AllowedMethod>
            <AllowedMethod>HEAD</AllowedMethod>
            <MaxAgeSeconds>3000</MaxAgeSeconds>
            <AllowedHeader>*</AllowedHeader>
        </CORSRule>
    </CORSConfiguration>
    Click "Edit bucket policy" and paste this (Replace the bucket name with your own):

    {
        "Version": "2008-10-17",
        "Statement": [
            {
                "Sid": "AllowPublicRead",
                "Effect": "Allow",
                "Principal": {
                    "AWS": "*"
                },
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::YOURBUCKETNAMEHERE/*"
            }
        ]
    }
    Click Save

