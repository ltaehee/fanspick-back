const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const {
  VITE_ACCESS_KEY_ID,
  VITE_SECRET_ACCESS_KEY,
  VITE_REGION,
} = require('../../consts/app');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config();

const s3 = new S3Client({
  region: VITE_REGION,
  credentials: {
    accessKeyId: VITE_ACCESS_KEY_ID,
    secretAccessKey: VITE_SECRET_ACCESS_KEY,
  },
});

/* 단일 이미지 등록할때 url생성 */
const createPresignedUrl = async () => {
  const timestamp = Date.now();
  const s3Params = {
    Bucket: 'cinemahub-imgs',
    Key: `image/${timestamp}`,
  };

  try {
    const command = new PutObjectCommand(s3Params);
    const url = await getSignedUrl(s3, command, { expiresIn: 300 });
    return url;
  } catch (err) {
    throw new Error('presigned URL 생성중 오류');
  }
};

/* 다중 이미지 등록할때 url생성 */
const createMultiPresignedUrls = async (fileCount) => {
  const timestamp = Date.now();
  const s3ParamsArr = Array.from({ length: fileCount }, (_, index) => ({
    Bucket: 'fanspick',
    Key: `images/${timestamp}_${index}`,
  }));

  try {
    const urls = await Promise.all(
      s3ParamsArr.map(async (params) => {
        const command = new PutObjectCommand(params);
        return await getSignedUrl(s3, command, { expiresIn: 300 });
      }),
    );
    return urls;
  } catch (err) {
    throw new Error('다중 presigned URL 생성중 오류');
  }
};

module.exports = { createPresignedUrl, createMultiPresignedUrls };
