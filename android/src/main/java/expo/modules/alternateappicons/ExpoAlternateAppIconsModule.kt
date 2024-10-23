package expo.modules.alternateappicons

import android.content.ComponentName
import android.content.pm.PackageManager
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

const val MAIN_ACTIVITY_NAME = "MainActivity"

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
    val currentActivityComponent = appContext.activityProvider!!.currentActivity!!.componentName!!

    return retrieveIconNameFromComponent(currentActivityComponent)
  }

  private suspend fun setAlternateAppIcon(icon: String?): String? = withContext(Dispatchers.Main) {
    val currentActivityComponent = appContext.activityProvider!!.currentActivity!!.componentName

    val currentIconName = retrieveIconNameFromComponent(currentActivityComponent)

    if (currentIconName == icon) return@withContext icon

    val newActivityComponent = replaceMainActivitySimpleName(currentActivityComponent, icon)

    appContext.reactContext?.packageManager?.run {
      setComponentEnabledSetting(newActivityComponent, PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP)
      setComponentEnabledSetting(currentActivityComponent, PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP)
    }

    return@withContext icon
  }

  private fun getSimpleName(component: ComponentName): String = component.className.split('.').last()

  private fun retrieveIconNameFromComponent(component: ComponentName): String? =
    with(getSimpleName(component)) {
      when  {
        equals(MAIN_ACTIVITY_NAME) -> null
        startsWith(MAIN_ACTIVITY_NAME) -> substring(MAIN_ACTIVITY_NAME.length)
        else -> null
      }
    }

  private fun replaceMainActivitySimpleName(component: ComponentName, suffix: String?): ComponentName {
    val newActivitySimpleName = "$MAIN_ACTIVITY_NAME${suffix ?: ""}"
    val identifiers = component.className.split('.').toMutableList()
    identifiers[identifiers.size - 1] = newActivitySimpleName
    val packageName = component.packageName
    val newActivityName = identifiers.joinToString(".")
    return ComponentName(packageName, newActivityName)
  }

}
