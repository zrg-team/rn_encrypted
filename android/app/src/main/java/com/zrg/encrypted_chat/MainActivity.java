package com.zrg.encrypted_chat;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.content.Intent;
import android.app.Activity;
import android.os.Bundle;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

public class MainActivity extends ReactActivity {

  // @Override
  // protected void onCreate(Bundle savedInstanceState) {
  //   super.onCreate(savedInstanceState);
  //   if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
  //     NotificationManager manager = getSystemService(NotificationManager.class);
  //     // Private
  //     NotificationChannel notificationPrivateChannel = new NotificationChannel("Headups", "MainChannel", NotificationManager.IMPORTANCE_HIGH);
  //     notificationPrivateChannel.setShowBadge(true);
  //     notificationPrivateChannel.setDescription("Headups Notifications Private");
  //     notificationPrivateChannel.enableVibration(true);
  //     notificationPrivateChannel.enableLights(true);
  //     notificationPrivateChannel.setVibrationPattern(new long[]{400, 200, 400});
  //     manager.createNotificationChannel(notificationPrivateChannel);
  //     // Public
  //     NotificationChannel notificationPublicChannel = new NotificationChannel("PublicHeadups", "MainChannel", NotificationManager.IMPORTANCE_HIGH);
  //     notificationPublicChannel.setShowBadge(true);
  //     notificationPublicChannel.setDescription("Headups Notifications Public");
  //     notificationPublicChannel.enableVibration(true);
  //     notificationPublicChannel.enableLights(true);
  //     notificationPublicChannel.setVibrationPattern(new long[]{400, 200, 400});
  //     notificationPublicChannel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
  //     manager.createNotificationChannel(notificationPublicChannel);
  //   }
  //   Activity currentActivity = this;
  //   new android.os.Handler().postDelayed(
  //     new Runnable() {
  //         public void run() {
  //           SplashScreen.show(currentActivity);
  //         }
  //     },
  //     420
  //   );
  // }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "encrypted_chat";
  }
}
