package expo.modules.alternateappicons

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
    return null
  }

  private fun setAlternateAppIcon(icon: String?, promise: Promise): String? {
    return null
  }
}
