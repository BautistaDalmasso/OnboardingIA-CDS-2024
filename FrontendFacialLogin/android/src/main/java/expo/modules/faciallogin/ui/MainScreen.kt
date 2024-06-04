@file:OptIn(ExperimentalPermissionsApi::class)

package expo.modules.faciallogin.ui

import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.google.accompanist.permissions.ExperimentalPermissionsApi
import com.google.accompanist.permissions.PermissionState
import com.google.accompanist.permissions.isGranted
import com.google.accompanist.permissions.rememberPermissionState
import expo.modules.faciallogin.ui.camera.CameraScreen
import expo.modules.faciallogin.ui.no_permission.NoPermissionScreen

@Composable
fun MainScreen(onChangeEvent: (FloatArray, String) -> Unit) {

    val cameraPermissionState: PermissionState = rememberPermissionState(android.Manifest.permission.CAMERA)

    MainContent(
        hasPermission = cameraPermissionState.status.isGranted,
        onRequestPermission = cameraPermissionState::launchPermissionRequest,
        onChangeEvent = onChangeEvent
    )
}

@Composable
private fun MainContent(
    hasPermission: Boolean,
    onRequestPermission: () -> Unit,
    onChangeEvent: (FloatArray, String) -> Unit
) {

    if (hasPermission) {
        CameraScreen(onChangeEvent)
    } else {
        NoPermissionScreen(onRequestPermission)
    }
}
