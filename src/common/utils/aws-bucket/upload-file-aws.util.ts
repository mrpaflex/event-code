import { S3 } from 'aws-sdk';
import { ENVIRONMENT } from 'src/common/constants/environment/env.variable';

export const uploadFiles = async (file: Express.Multer.File) => {
  if (!file) {
    return;
  }

  const s3 = new S3({
    accessKeyId: ENVIRONMENT.AWS.accessKeyId,
    secretAccessKey: ENVIRONMENT.AWS.secretAccessKey,
  });

  const params = {
    Bucket: ENVIRONMENT.AWS.Bucket,
    Key: file.filename,
    Body: file.buffer,
  };

  return await s3.upload(params).promise();
};

export const deletePostFile = async (images: any) => {
  if (!images) {
    return;
  }
  if (
    !images ||
    !Array.isArray(images) ||
    typeof images !== 'object' ||
    !(Array.isArray(images) && images.map((image) => image.Key))
  ) {
    return;
  }

  const s3 = new S3({
    accessKeyId: ENVIRONMENT.AWS.accessKeyId,
    secretAccessKey: ENVIRONMENT.AWS.secretAccessKey,
  });

  const imagesKey = images.map((imageKey) => ({ Key: imageKey.key }));

  const params = {
    Bucket: ENVIRONMENT.AWS.BucketName,
    Delete: {
      Objects: imagesKey,
      Quiet: false,
    },
  };

  return new Promise((resolve, reject) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};
