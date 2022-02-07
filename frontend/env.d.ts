declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_CLOUDINARY_URL: string;
    REACT_APP_CLOUDINARY_NAME: string;
    REACT_APP_CLOUDINARY_API_KEY: string;
    REACT_APP_CLOUDINARY_API_SECRET: string;
  }
}

declare module "react-facebook-login/dist/facebook-login-render-props";
