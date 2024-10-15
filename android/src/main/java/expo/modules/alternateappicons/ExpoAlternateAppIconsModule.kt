package expo.modules.alternateappicons

import android.content.ComponentName
import android.content.pm.PackageManager
import expo.modules.kotlin.Promise
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

const val MAIN_ACTIVITY_NAME = ".MainActivity"

class ExpoAlternateAppIconsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoAlternateAppIcons")

    Constants(
      "supportsAlternateIcons" to true
    )

    Function("getAppIconName", this@ExpoAlternateAppIconsModule::getAppIconName)
    AsyncFunction("setAlternateAppIcon").Coroutine(this@ExpoAlternateAppIconsModule::setAlternateAppIcon)
  }

  private fun getAppIconName(): String? {
    val activityName = appContext.activityProvider?.currentActivity?.componentName?.shortClassName

    if(activityName !== null && !activityName.startsWith(MAIN_ACTIVITY_NAME) || activityName == MAIN_ACTIVITY_NAME) return null

    return activityName?.substring(MAIN_ACTIVITY_NAME.length)
  }

  private suspend fun setAlternateAppIcon(icon: String?): String? = withContext(Dispatchers.Main) {
    val currentActivityComponent = appContext.activityProvider?.currentActivity?.componentName

    if (currentActivityComponent == null || !currentActivityComponent.shortClassName.startsWith(MAIN_ACTIVITY_NAME)) return@withContext null

    val newActivityName = "$MAIN_ACTIVITY_NAME${icon ?: ""}"

    if (currentActivityComponent.shortClassName == newActivityName) return@withContext icon

    val packageName = currentActivityComponent.packageName;
    val newActivityComponent = ComponentName(packageName, "$packageName$newActivityName")

    appContext.reactContext?.packageManager?.run {
      setComponentEnabledSetting(newActivityComponent, PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP)
      setComponentEnabledSetting(currentActivityComponent, PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP)
    }

    return@withContext icon
  }
}
