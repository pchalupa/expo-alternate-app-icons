package expo.modules.alternateappicons

import android.content.ComponentName
import android.content.pm.PackageManager
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoAlternateAppIconsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoAlternateAppIcons")

    Constants(
      "supportsAlternateIcons" to true
    )

    Function("getAppIconName", this@ExpoAlternateAppIconsModule::getAppIconName)
    AsyncFunction("setAlternateAppIcon", this@ExpoAlternateAppIconsModule::setAlternateAppIcon)
  }

  private fun getAppIconName(): String? {
    val activityName = appContext.activityProvider?.currentActivity?.componentName?.shortClassName

    if(activityName !== null && activityName.startsWith(".MainActivity")) return null


    println("activity name is:")
    println(activityName)


    return activityName
  }

  private fun setAlternateAppIcon(icon: String?, promise: Promise): String? {
    appContext.reactContext?.packageManager?.setComponentEnabledSetting(ComponentName("expo.modules.alternateappicons.example", "expo.modules.alternateappicons.example.MainActivityLight"), PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP)
    appContext.reactContext?.packageManager?.setComponentEnabledSetting(ComponentName("expo.modules.alternateappicons.example", "expo.modules.alternateappicons.example.MainActivity"), PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP)

    promise.resolve(icon)

    return icon
  }
}
