package com.prch.cauldron

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    // Firebase initializes automatically from google-services.json
    // This is handled by the Google Services gradle plugin
    if (FirebaseApp.getApps(this).isEmpty()) {
      try {
        FirebaseApp.initializeApp(this)
        android.util.Log.d("MainApplication", "Firebase initialized successfully from google-services.json")
      } catch (e: Exception) {
        android.util.Log.w("MainApplication", "Failed to initialize Firebase", e)
      }
    }

    super.onCreate()
    loadReactNative(this)
  }
}
