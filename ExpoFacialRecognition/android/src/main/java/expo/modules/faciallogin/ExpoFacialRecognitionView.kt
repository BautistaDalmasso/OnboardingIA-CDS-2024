package expo.modules.facialrecognition

import android.content.Context
import androidx.compose.ui.platform.ComposeView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView
import expo.modules.facialrecognition.ui.MainScreen

class ExpoFacialRecognitionView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
    private val onChangeEvent by EventDispatcher()

    var onChangeFn: ((FloatArray, String) -> Unit) = { embedding, error ->
        println("Rostro: ${embedding.joinToString()}")
        println("Error: $error")
        onChangeEvent(mapOf(
            "embedding" to embedding, "error" to error
        ))
    }

    internal val composeView = ComposeView(context).also {

        it.layoutParams = LayoutParams(
                LayoutParams.WRAP_CONTENT,
                LayoutParams.WRAP_CONTENT
        )

        it.setContent {
            MainScreen(onChangeFn)
        }

        addView(it)
    }
}