import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer.js';
import {authApi} from '@/api/authApi.js'
import { courseApi } from '@/api/courseApi.js';
import { purchaseApi } from '@/api/PurchesApi.js';
import { courseProgressApi } from '@/api/courseProgressApi.js';
export const appStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware, courseApi.middleware,purchaseApi.middleware, courseProgressApi.middleware), // Add RTK Query middleware
  });

  const intializedApp = async()=>{
    await appStore.dispatch(authApi.endpoints.loadUser.initiate({},{forceRefetch:true}));
  }
  intializedApp();