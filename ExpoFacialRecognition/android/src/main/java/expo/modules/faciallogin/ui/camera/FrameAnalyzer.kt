package expo.modules.facialrecognition.ui.camera

import androidx.annotation.OptIn
import androidx.camera.core.ExperimentalGetImage
import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.util.Log
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import expo.modules.facialrecognition.model.FaceNetModel
import expo.modules.facialrecognition.model.Models
import expo.modules.facialrecognition.BitmapUtils
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlin.coroutines.suspendCoroutine
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlin.math.pow
import kotlin.math.sqrt

// Analyser class to process frames and produce detections.
class FrameAnalyzer(
    private val context: Context,
    private val onChange: (FloatArray, String) -> Unit
) : ImageAnalysis.Analyzer {

    companion object {
        const val THROTTLE_TIMEOUT_MS = 500L
    }

    // Use the device's GPU to perform faster computations.
    // Refer https://www.tensorflow.org/lite/performance/gpu
    private val useGpu = true

    // Use XNNPack to accelerate inference.
    // Refer https://blog.tensorflow.org/2020/07/accelerating-tensorflow-lite-xnnpack-integration.html
    private val useXNNPack = true

    // You may the change the models here.
    // Use the model configs in Models.kt
    // Default is Models.FACENET ; Quantized models are faster
    private val modelInfo = Models.FACENET

    private var isProcessing = false

    //private val scope: CoroutineScope = CoroutineScope(Dispatchers.IO + SupervisorJob())
    private lateinit var faceNetModel : FaceNetModel
    private val realTimeOpts = FaceDetectorOptions.Builder()
            .setPerformanceMode( FaceDetectorOptions.PERFORMANCE_MODE_FAST )
            .build()
    private val detector = FaceDetection.getClient(realTimeOpts)

    init {
        faceNetModel = FaceNetModel( context , modelInfo , useGpu , useXNNPack )
    }


    @SuppressLint("UnsafeOptInUsageError")
    override fun analyze(image: ImageProxy) {
        if (isProcessing) {
            image.close()
            return
        }
        else {
            isProcessing = true

            //val cameraXImage = image.image!!
            //var frameBitmap = Bitmap.createBitmap( cameraXImage.width , cameraXImage.height , Bitmap.Config.ARGB_8888 )
            //frameBitmap.copyPixelsFromBuffer( image.planes[0].buffer )
            //frameBitmap = BitmapUtils.rotateBitmap( frameBitmap , image.imageInfo.rotationDegrees.toFloat() )
            val frameBitmap = BitmapUtils.imageToBitmap( image.image!! , image.imageInfo.rotationDegrees )

            val inputImage = InputImage.fromBitmap( frameBitmap , 0 )
            detector.process(inputImage)
                .addOnSuccessListener { faces ->
                    CoroutineScope( Dispatchers.Default ).launch {
                        runModel( faces , frameBitmap )
                    }
                }
                .addOnCompleteListener {
                    image.close()
                }
        }
    }

    private suspend fun runModel( faces : List<Face> , cameraFrameBitmap : Bitmap ){
        withContext( Dispatchers.Default ) {
            delay(THROTTLE_TIMEOUT_MS)

            if (faces.size == 0) {
                onChange(FloatArray(0), "Coloca tu rostro en la cámara")
            }

            if (faces.size > 1) {
                onChange(FloatArray(0), "Hay mas de un rostro en la cámara")
            }

            if (faces.size == 1) {
                try {
                    val face = faces[0]
                    val croppedBitmap = BitmapUtils.cropRectFromBitmap( cameraFrameBitmap , face.boundingBox )
                    val subject = faceNetModel.getFaceEmbedding( croppedBitmap )
                    onChange(subject, "")
                }
                catch(e: Exception) {
                    Log.e("FACE EMBEDDING ERROR", e.toString())
                }
            }

            withContext( Dispatchers.Main ) {
                isProcessing = false
            }
        }
    }

}