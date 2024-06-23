package expo.modules.facialrecognition

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoFacialRecognitionModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("FacialRecognitionView")

    View(ExpoFacialRecognitionView::class) {
      Events("onChangeEvent")
    }
  }
}