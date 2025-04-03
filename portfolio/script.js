document.addEventListener("DOMContentLoaded", () => {
    // Custom Cursor
    const cursor = document.getElementById("cursor");
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    // Particle Background with Mouse Interaction
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("particles"), alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;

    const particles = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 20;
        positions[i + 1] = (Math.random() - 0.5) * 20;
        positions[i + 2] = (Math.random() - 0.5) * 20;
        velocities[i] = (Math.random() - 0.5) * 0.01;
        velocities[i + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i + 2] = (Math.random() - 0.5) * 0.01;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0x4f46e5, size: 0.03, blending: THREE.AdditiveBlending });
    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    let mouseX = 0, mouseY = 0;
    document.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animateParticles() {
        const pos = particles.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
            pos[i] += velocities[i] + mouseX * 0.005;
            pos[i + 1] += velocities[i + 1] + mouseY * 0.005;
            pos[i + 2] += velocities[i + 2];
            if (Math.abs(pos[i]) > 10) velocities[i] *= -1;
            if (Math.abs(pos[i + 1]) > 10) velocities[i + 1] *= -1;
            if (Math.abs(pos[i + 2]) > 10) velocities[i + 2] *= -1;
        }
        particles.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // GSAP Animations
    gsap.from(".glow-text", { opacity: 0, y: 20, duration: 1, delay: 0.5 });
    gsap.utils.toArray(".opacity-0").forEach(el => {
        gsap.from(el, { opacity: 0, y: 50, duration: 1, scrollTrigger: { trigger: el } });
    });
    gsap.to(".parallax-bg::before", { y: "50%", scrollTrigger: { trigger: ".parallax-bg", scrub: true } });

    // Dark Mode Toggle
    const toggle = document.getElementById("dark-toggle");
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("light");
        toggle.textContent = document.body.classList.contains("light") ? "🌞" : "🌙";
    });

    // Audio Toggle
    const sound = new Howl({ src: ['https://www.soundjay.com/buttons/beep-01a.mp3'], loop: true, volume: 0.2 });
    const audioToggle = document.getElementById("audio-toggle");
    let audioOn = false;
    audioToggle.addEventListener("click", () => {
        audioOn = !audioOn;
        audioToggle.textContent = audioOn ? "🔇" : "🔊";
        audioOn ? sound.play() : sound.stop();
    });

    // Terminal Form
    const typewriter = document.querySelector(".typewriter-input");
    const text = typewriter.dataset.text;
    typewriter.textContent = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            typewriter.textContent += text[i];
            i++;
            setTimeout(type, 50);
        }
    }
    type();

    const form = document.querySelector(".terminal-form");
    const nameInput = form.querySelector("input[type='text']");
    nameInput.addEventListener("input", (e) => {
        if (e.target.value.toLowerCase() === "help") {
            alert("> Commands: 'clear' to reset, 'whoami' for bio, 'exit' to close.");
        } else if (e.target.value.toLowerCase() === "whoami") {
            alert("> Alex Coder: Code ninja, coffee addict.");
        } else if (e.target.value.toLowerCase() === "clear") {
            form.reset();
        } else if (e.target.value.toLowerCase() === "exit") {
            window.close(); // Won’t work in most browsers, but fun!
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Signal sent! (Demo—add a backend for real transmission.)");
        form.reset();
    });

    // Project Modal
    const modal = document.getElementById("project-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalMedia = document.getElementById("modal-media");
    const modalClose = document.getElementById("modal-close");

    const projects = {
        taskmaster: { title: "TaskMaster", desc: "A snarky CLI task manager built with Python.", media: "<iframe width='100%' height='300' src='https://www.youtube.com/embed/dQw4w9WgXcQ' frameborder='0' allowfullscreen></iframe>" },
        weatherx: { title: "WeatherX", desc: "A stylish weather app using React and APIs.", media: "<img src='https://via.placeholder.com/400x200?text=WeatherX+Preview' alt='WeatherX'>" },
        codebot: { title: "CodeBot", desc: "An AI-powered coding assistant with Node.js.", media: "<img src='https://via.placeholder.com/400x200?text=CodeBot+Preview' alt='CodeBot'>" }
    };

    document.querySelectorAll(".project-card button").forEach(btn => {
        btn.addEventListener("click", () => {
            const project = btn.closest(".project-card").dataset.project;
            modalTitle.textContent = projects[project].title;
            modalDesc.textContent = projects[project].desc;
            modalMedia.innerHTML = projects[project].media;
            modal.classList.remove("hidden");
            gsap.from(modal.children[0], { scale: 0.8, opacity: 0, duration: 0.5 });
        });
    });

    modalClose.addEventListener("click", () => {
        gsap.to(modal.children[0], {
            scale: 0.8, opacity: 0, duration: 0.5, onComplete: () => modal.classList.add("hidden")
        });
    });
});