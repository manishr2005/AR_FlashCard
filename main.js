const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './KLM.mind',
			maxTrack: 3,
        });

        const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
 		const Kite = await  loadGLTF('./Kite/scene.gltf');
		Kite.scene.scale.set(0.02, 0.02, 0.02);
		
		// calling KiteAclip and we are loading the audio from our hard disk
		const KiteAclip = await loadAudio("./sound/Kite.mp3");
		const KiteListener = new THREE.AudioListener();
		const KiteAudio = new THREE.PositionalAudio(KiteListener);
		
		const Lamp = await  loadGLTF('./Lamp/scene.gltf');
		Lamp.scene.scale.set(0.002, 0.002, 0.002);
		
		const Motor = await  loadGLTF('./Motor/scene.gltf');
		Motor.scene.scale.set(0.02, 0.02, 0.02);
		Motor.scene.position.set(0, -0.4, 0);
		
		const LampMixer = new THREE.AnimationMixer(Lamp.scene);
		const LampAction = LampMixer.clipAction(Lamp.animations[0]);
		LampAction.play();
		
		const LampAclip = await loadAudio("./sound/Lamp.mp3");
		const LampListener = new THREE.AudioListener();
		const LampAudio = new THREE.PositionalAudio(LampListener);
		
		const MotorMixer = new THREE.AnimationMixer(Motor.scene);
		const MotorAction = MotorMixer.clipAction(Motor.animations[0]);
		MotorAction.play();
		
		const MotorAclip = await loadAudio("./sound/Motor.mp3");
		const MotorListener = new THREE.AudioListener();
		const MotorAudio = new THREE.PositionalAudio(MotorListener);
		
		const KiteAnchor = mindarThree.addAnchor(0);
		KiteAnchor.group.add(Kite.scene);
		camera.add(KiteListener);
		KiteAudio.setRefDistance(300);
		KiteAudio.setBuffer(KiteAclip);
		KiteAudio.setLoop(true);
		KiteAnchor.group.add(KiteAudio)
		
		KiteAnchor.onTargetFound = () => {
			KiteAudio.play();
		}
		
		KiteAnchor.onTargetLost = () => {
			KiteAudio.pause(); 
		}
		
		const LampAnchor = mindarThree.addAnchor(1);
		LampAnchor.group.add(Lamp.scene);
		camera.add(LampListener);
		LampAudio.setRefDistance(300);
		LampAudio.setBuffer(LampAclip);
		LampAudio.setLoop(true);
		LampAnchor.group.add(LampAudio)
		
		LampAnchor.onTargetFound = () => {
			LampAudio.play();
		}
		
		LampAnchor.onTargetLost = () => {
			LampAudio.pause(); 
		}
		
		
		const MotorAnchor = mindarThree.addAnchor(2);
		MotorAnchor.group.add(Motor.scene);
		camera.add(MotorListener);
		MotorAudio.setRefDistance(300);
		MotorAudio.setBuffer(MotorAclip);
		MotorAudio.setLoop(true);
		MotorAnchor.group.add(MotorAudio)
		
		MotorAnchor.onTargetFound = () => {
			MotorAudio.play();
		}
		
		MotorAnchor.onTargetLost = () => {
			MotorAudio.pause(); 
		}
		
		const clock = new THREE.Clock();
		
        await mindarThree.start();

        renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			MotorMixer.update(delta);
			LampMixer.update(delta);
			Lamp.scene.rotation.set(0, Lamp.scene.rotation.y + delta, 0);
			Kite.scene.rotation.set(0, Kite.scene.rotation.y + delta, 0);
			Motor.scene.rotation.set(0, Motor.scene.rotation.y + delta, 0);
            renderer.render(scene, camera);
        });
    }

    start();
});