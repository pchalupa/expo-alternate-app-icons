import ExpoModulesCore

public class ExpoAlternateAppIconsModule: Module {
    private var supportsAlternateIcons = UIApplication.shared.supportsAlternateIcons;

    public func definition() -> ModuleDefinition {
        Name("ExpoAlternateAppIcons")

        Constants({
          return [
            "supportsAlternateIcons": self.supportsAlternateIcons
          ]
        })

        AsyncFunction("setAlternateAppIcon", setAlternateAppIcon)
        Function("getAppIconName", getAppIconName)
    }

    private func getAppIconName() -> String? {
        return UIApplication.shared.alternateIconName;
    }

    private func setAlternateAppIcon(icon: String?, promise: Promise) -> Void {
        Task { @MainActor in
            do {
                try await UIApplication.shared.setAlternateIconName(icon);

                promise.resolve(icon);
            } catch {
                promise.reject(error);
            }
        }
    }
}
