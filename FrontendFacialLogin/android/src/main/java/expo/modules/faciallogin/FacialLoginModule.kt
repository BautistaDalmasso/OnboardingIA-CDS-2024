package expo.modules.faciallogin

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class FacialLoginModule : Module() {

  override fun definition() = ModuleDefinition {
    Name("FacialLoginView")

    View(FacialLoginView::class) {
      Events("onChangeEvent")

      //Prop("onChangeEvent") { view: FacialLoginView, prop: (FloatArray, String) -> Unit ->
      //  prop.invoke(FloatArray(0), "Prueba")
      //  view.onChangeEvent = prop
      //}
    }
  }
}