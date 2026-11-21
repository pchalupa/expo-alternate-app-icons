import ExpoModulesCore

public class ExpoAlternateAppIconsModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ExpoAlternateAppIcons")

        Constants({
          return [
            "supportsAlternateIcons": self.readOnMainThread { UIApplication.shared.supportsAlternateIcons }
          ]
        })

        AsyncFunction("setAlternateAppIcon", setAlternateAppIcon)
        Function("getAppIconName", getAppIconName)
    }

    private func getAppIconName() -> String? {
        return readOnMainThread { UIApplication.shared.alternateIconName }
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

    // Constants and synchronous functions run on the JS thread, but UIApplication
    // may only be read on the main thread.
    private func readOnMainThread<T: Sendable>(_ read: @MainActor () -> T) -> T {
        if Thread.isMainThread {
            return MainActor.assumeIsolated(read)
        }
        return DispatchQueue.main.sync(execute: read)
    }
}
