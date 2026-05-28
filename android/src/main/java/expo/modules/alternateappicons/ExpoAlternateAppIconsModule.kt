package expo.modules.alternateappicons

import android.content.ComponentName
import android.content.pm.PackageManager
import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

const val MAIN_ACTIVITY_NAME = "MainActivity"
const val DEFAULT_ALIAS_NAME = "MainActivityDefault"

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
    val pm = appContext.reactContext?.packageManager ?: return null
    val packageName = appContext.reactContext?.packageName ?: return null

    try {
      // Query all activities to find the currently enabled one
      // Current activity will be MainActivity if opened from deep-link/shortcuts, is not reflect current app icon
      val packageInfo = pm.getPackageInfo(
        packageName, 
        PackageManager.GET_ACTIVITIES or PackageManager.GET_DISABLED_COMPONENTS
      )
      
      packageInfo.activities?.forEach { activityInfo ->
        val name = activityInfo.name.split('.').last()
        
        // Skip the base MainActivity (always enabled)
        if (name == MAIN_ACTIVITY_NAME) return@forEach
        
        if (name.startsWith(MAIN_ACTIVITY_NAME)) {
          val componentName = ComponentName(packageName, activityInfo.name)
          val state = pm.getComponentEnabledSetting(componentName)
          
          if (state == PackageManager.COMPONENT_ENABLED_STATE_ENABLED) {
            if (name == DEFAULT_ALIAS_NAME) return null
            return name.substring(MAIN_ACTIVITY_NAME.length)
          } else if (name == DEFAULT_ALIAS_NAME && state == PackageManager.COMPONENT_ENABLED_STATE_DEFAULT) {
            // Default alias is implicitly enabled at first
            return null
          }
        }
      }
    } catch (e: Exception) {
      e.printStackTrace()
    }
    return null
  }

  private suspend fun setAlternateAppIcon(icon: String?): String? = withContext(Dispatchers.Main) {
    val pm = appContext.reactContext?.packageManager ?: return@withContext icon
    val packageName = appContext.reactContext?.packageName ?: return@withContext icon

    // Map null to "Default", targets MainActivityDefault
    val targetAliasName = if (icon == null || icon == "Default") {
      DEFAULT_ALIAS_NAME
    } else {
      "$MAIN_ACTIVITY_NAME$icon"
    }

    try {
      val packageInfo = pm.getPackageInfo(
        packageName, 
        PackageManager.GET_ACTIVITIES or PackageManager.GET_DISABLED_COMPONENTS
      )
      
      // Prevent unknown icon failures
      val aliasActivities = packageInfo.activities?.filter { activityInfo ->
        val name = activityInfo.name.split('.').last()
        name != MAIN_ACTIVITY_NAME && name.startsWith(MAIN_ACTIVITY_NAME)
      }
      .orEmpty()
      val targetExists = aliasActivities.any {
        it.name.split('.').last() == targetAliasName
      }
      if (!targetExists) {
        throw IllegalArgumentException("Unknown app icon alias: $icon")
      }

      aliasActivities.forEach { activityInfo ->
        val name = activityInfo.name.split('.').last()
        
        // Never disable MainActivity
        if (name == MAIN_ACTIVITY_NAME) return@forEach
        
        val componentName = ComponentName(packageName, activityInfo.name)

        // Enable the target, disable all other aliases
        if (name == targetAliasName) {
          pm.setComponentEnabledSetting(
            componentName,
            PackageManager.COMPONENT_ENABLED_STATE_ENABLED,
            PackageManager.DONT_KILL_APP
          )
        } else if (name.startsWith(MAIN_ACTIVITY_NAME)) {
          pm.setComponentEnabledSetting(
            componentName,
            PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
            PackageManager.DONT_KILL_APP
          )
        }
      }
    } catch (e: Exception) {
      e.printStackTrace()
    }

    return@withContext if (icon == "Default") null else icon
  }

}
