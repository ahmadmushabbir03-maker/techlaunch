(function () {
  "use strict";

  const overlay = document.getElementById("demoOverlay");
  const content = document.getElementById("demoModalContent");
  const close = document.getElementById("demoClose");
  const toast = document.getElementById("demoToast");
  const toastText = document.getElementById("demoToastText");

  if (!overlay || !content) return;

  const skills = [
    ["Azure", 88],
    ["Jenkins", 90],
    ["Terraform", 72],
    ["Docker", 68],
    ["Kubernetes", 55],
    ["Node.js", 84],
    ["MongoDB", 82]
  ];

  function showToast(message) {
    toastText.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  function openModal(html) {
    content.innerHTML = html;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function skillsView() {
    openModal(`
      <span class="demo-kicker">Career Intelligence</span>
      <h2 class="demo-modal-title">Skill Readiness Analysis</h2>
      <p class="demo-modal-subtitle">
        TechLaunch compares your current capability against the
        expected level for your target DevOps role.
      </p>

      <div class="demo-skill-grid">
        ${skills.map(([name, score]) => `
          <div class="demo-skill">
            <div class="demo-skill-head">
              <span>${name}</span>
              <strong>${score}%</strong>
            </div>
            <div class="demo-skill-track">
              <div class="demo-skill-fill" data-width="${score}%"></div>
            </div>
          </div>
        `).join("")}
      </div>

      <div class="viz-callout" style="margin-top:25px;padding:17px;">
        <strong>Career insight:</strong>
        Your strongest areas are Jenkins and Azure.
        Kubernetes is currently the largest development opportunity.
      </div>
    `);

    setTimeout(() => {
      document.querySelectorAll(".demo-skill-fill").forEach((bar) => {
        bar.style.width = bar.dataset.width;
      });
    }, 80);
  }

  function projectsView() {
    openModal(`
      <span class="demo-kicker">Portfolio</span>
      <h2 class="demo-modal-title">TechLaunch Project Portfolio</h2>
      <p class="demo-modal-subtitle">
        A visual overview of projects demonstrating cloud,
        DevOps automation and infrastructure skills.
      </p>

      <div class="demo-skill-grid">
        <div class="demo-skill">
          <h4>Azure Node.js Deployment</h4>
          <p class="demo-modal-subtitle">
            Node.js + MongoDB deployed through Azure App Service.
          </p>
          <span class="viz-badge">DEPLOYED</span>
        </div>

        <div class="demo-skill">
          <h4>Cloud Infrastructure</h4>
          <p class="demo-modal-subtitle">
            Infrastructure as Code using Terraform.
          </p>
          <span class="viz-badge">90% COMPLETE</span>
        </div>

        <div class="demo-skill">
          <h4>CI/CD Automation</h4>
          <p class="demo-modal-subtitle">
            Jenkins build, test, artifact and deployment pipeline.
          </p>
          <span class="viz-badge">BUILDING</span>
        </div>

        <div class="demo-skill">
          <h4>Database Integration</h4>
          <p class="demo-modal-subtitle">
            MongoDB persistence with REST API integration.
          </p>
          <span class="viz-badge">CONNECTED</span>
        </div>
      </div>
    `);
  }

  function learningView() {
    openModal(`
      <span class="demo-kicker">AI-style Career Planner</span>
      <h2 class="demo-modal-title">Your DevOps Learning Roadmap</h2>
      <p class="demo-modal-subtitle">
        TechLaunch identified Kubernetes as the highest-priority
        skill gap for your current profile.
      </p>

      <div class="demo-roadmap">

        <div class="demo-roadmap-step">
          <div class="demo-step-number">1</div>
          <div>
            <h4>Container Fundamentals</h4>
            <p>Understand images, containers, registries and networking.</p>
          </div>
        </div>

        <div class="demo-roadmap-step">
          <div class="demo-step-number">2</div>
          <div>
            <h4>Kubernetes Architecture</h4>
            <p>Learn pods, deployments, services and namespaces.</p>
          </div>
        </div>

        <div class="demo-roadmap-step">
          <div class="demo-step-number">3</div>
          <div>
            <h4>Azure Kubernetes Service</h4>
            <p>Deploy and operate container workloads in Azure.</p>
          </div>
        </div>

        <div class="demo-roadmap-step">
          <div class="demo-step-number">4</div>
          <div>
            <h4>Production CI/CD</h4>
            <p>Connect Kubernetes deployments with Jenkins automation.</p>
          </div>
        </div>

      </div>

      <button class="btn btn-primary w-100 mt-3" id="startLearning" type="button">
        Start Learning Plan
      </button>
    `);

    document.getElementById("startLearning").addEventListener("click", () => {
      showToast("Learning plan activated");
      closeModal();
    });
  }

  function jobsView() {
    openModal(`
      <span class="demo-kicker">Market Intelligence</span>
      <h2 class="demo-modal-title">Recommended Opportunities</h2>
      <p class="demo-modal-subtitle">
        Roles matched against your current Azure, Jenkins,
        Terraform and container skills.
      </p>

      <div class="demo-job-card">
        <div>
          <h3>DevOps Engineer</h3>
          <p class="demo-modal-subtitle">
            Toronto, Canada · Hybrid · Entry Level
          </p>
          <div class="tech-tags">
            <span>Azure</span>
            <span>Terraform</span>
            <span>Jenkins</span>
          </div>
        </div>

        <div class="demo-match">
          <strong>86%</strong>
          <span>MATCH</span>
        </div>
      </div>

      <div class="demo-job-card">
        <div>
          <h3>Cloud Engineer</h3>
          <p class="demo-modal-subtitle">
            Toronto, Canada · Remote · Entry Level
          </p>
          <div class="tech-tags">
            <span>Azure</span>
            <span>Docker</span>
            <span>Kubernetes</span>
          </div>
        </div>

        <div class="demo-match">
          <strong>79%</strong>
          <span>MATCH</span>
        </div>
      </div>

      <div class="demo-job-card">
        <div>
          <h3>DevOps Engineer</h3>
          <p class="demo-modal-subtitle">
            Bengaluru, India · Entry Level
          </p>
          <div class="tech-tags">
            <span>Azure</span>
            <span>Jenkins</span>
            <span>Docker</span>
          </div>
        </div>

        <div class="demo-match">
          <strong>84%</strong>
          <span>MATCH</span>
        </div>
      </div>
    `);
  }

  function marketView() {
    openModal(`
      <span class="demo-kicker">Market Insights</span>
      <h2 class="demo-modal-title">India vs Toronto</h2>
      <p class="demo-modal-subtitle">
        Compare the target career market selected for your profile.
      </p>

      <div class="demo-market-comparison">

        <div class="demo-market-box">
          <h3>🇨🇦 Toronto</h3>

          <div class="demo-market-stat">
            <span>Target Role</span>
            <strong>DevOps</strong>
          </div>

          <div class="demo-market-stat">
            <span>Cloud Demand</span>
            <strong>High</strong>
          </div>

          <div class="demo-market-stat">
            <span>Priority Skill</span>
            <strong>Azure</strong>
          </div>

          <div class="demo-market-stat">
            <span>Infrastructure</span>
            <strong>Terraform</strong>
          </div>
        </div>

        <div class="demo-market-box">
          <h3>🇮🇳 India</h3>

          <div class="demo-market-stat">
            <span>Target Role</span>
            <strong>DevOps</strong>
          </div>

          <div class="demo-market-stat">
            <span>Cloud Demand</span>
            <strong>High</strong>
          </div>

          <div class="demo-market-stat">
            <span>Priority Skill</span>
            <strong>Jenkins</strong>
          </div>

          <div class="demo-market-stat">
            <span>Infrastructure</span>
            <strong>Docker</strong>
          </div>
        </div>

      </div>
    `);
  }

  function healthView() {
    openModal(`
      <span class="demo-kicker">Platform Monitoring</span>
      <h2 class="demo-modal-title">System Health</h2>
      <p class="demo-modal-subtitle">
        Current TechLaunch application infrastructure status.
      </p>

      <div class="demo-health-grid">

        <div class="demo-health-item">
          <strong>● HEALTHY</strong>
          <span>Node.js / Express API</span>
        </div>

        <div class="demo-health-item">
          <strong>● CONNECTED</strong>
          <span>MongoDB Database</span>
        </div>

        <div class="demo-health-item">
          <strong>● READY</strong>
          <span>Azure App Service</span>
        </div>

        <div class="demo-health-item">
          <strong>● READY</strong>
          <span>Jenkins CI/CD</span>
        </div>

      </div>
    `);
  }

  function deploymentView() {
    openModal(`
      <span class="demo-kicker">DevOps Automation</span>
      <h2 class="demo-modal-title">Deployment Pipeline</h2>
      <p class="demo-modal-subtitle">
        Demonstration of the CI/CD flow that will eventually be
        executed by Jenkins.
      </p>

      <div class="demo-pipeline">

        <div class="pipeline-track">

          <div class="pipeline-stage" data-stage="0">
            <div class="pipeline-node">01</div>
            <span>GitHub</span>
          </div>

          <div class="pipeline-line" data-line="0"></div>

          <div class="pipeline-stage" data-stage="1">
            <div class="pipeline-node">02</div>
            <span>Build</span>
          </div>

          <div class="pipeline-line" data-line="1"></div>

          <div class="pipeline-stage" data-stage="2">
            <div class="pipeline-node">03</div>
            <span>Test</span>
          </div>

          <div class="pipeline-line" data-line="2"></div>

          <div class="pipeline-stage" data-stage="3">
            <div class="pipeline-node">04</div>
            <span>Artifact</span>
          </div>

          <div class="pipeline-line" data-line="3"></div>

          <div class="pipeline-stage" data-stage="4">
            <div class="pipeline-node">05</div>
            <span>Azure</span>
          </div>

          <div class="pipeline-line" data-line="4"></div>

          <div class="pipeline-stage" data-stage="5">
            <div class="pipeline-node">06</div>
            <span>Health</span>
          </div>

        </div>

        <div class="viz-callout mt-4" id="pipelineMessage"
             style="padding:17px;">
          Ready to deploy TechLaunch.
        </div>

        <button class="btn btn-primary w-100 mt-4" id="startDeployment" type="button">
          Start Deployment Simulation
        </button>

      </div>
    `);

    const stages = document.querySelectorAll(".pipeline-stage");
    const lines = document.querySelectorAll(".pipeline-line");
    const message = document.getElementById("pipelineMessage");
    const button = document.getElementById("startDeployment");

    const names = [
      "Cloning repository...",
      "Building Node.js application...",
      "Running automated tests...",
      "Publishing deployment artifact...",
      "Deploying to Azure App Service...",
      "Checking application health..."
    ];

    button.addEventListener("click", () => {
      button.disabled = true;
      button.textContent = "Deployment Running...";

      stages.forEach((stage) => {
        stage.classList.remove("active", "complete");
      });

      lines.forEach((line) => {
        line.classList.remove("complete");
      });

      let current = 0;

      const runStage = () => {
        if (current > 0) {
          stages[current - 1].classList.remove("active");
          stages[current - 1].classList.add("complete");

          if (lines[current - 1]) {
            lines[current - 1].classList.add("complete");
          }
        }

        if (current < stages.length) {
          stages[current].classList.add("active");
          message.textContent = names[current];
          current++;
          setTimeout(runStage, 850);
        } else {
          message.innerHTML =
            "<strong>✓ Deployment Successful</strong> — " +
            "Application health check returned HTTP 200.";
          button.textContent = "Deployment Complete";
          showToast("Deployment simulation completed");
        }
      };

      runStage();
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest(".demo-action");

    if (!target) return;

    const action = target.dataset.action;

    if (action === "skills") skillsView();
    if (action === "projects") projectsView();
    if (action === "learning") learningView();
    if (action === "jobs") jobsView();
    if (action === "job-details") jobsView();
    if (action === "health") healthView();
    if (action === "deploy") deploymentView();
  });

  close.addEventListener("click", closeModal);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  // Market cards
  document.querySelectorAll(".market-card").forEach((card) => {
    card.addEventListener("click", marketView);
  });

  // Market Insights header button
  document.querySelectorAll("a, button").forEach((element) => {
    if (element.textContent.trim() === "Market Insights") {
      element.addEventListener("click", (event) => {
        event.preventDefault();
        marketView();
      });
    }
  });

})();
