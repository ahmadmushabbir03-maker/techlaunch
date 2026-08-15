(function () {

  "use strict";

  // ----------------------------------------------------------
  // BADGE INTERACTION
  // ----------------------------------------------------------

  document.querySelectorAll(".badge-action").forEach(function (button) {

    button.addEventListener("click", function () {

      const badge = button.dataset.badge;

      if (badge === "Kubernetes Ready") {
        button.textContent = "Roadmap Required";
        return;
      }

      button.textContent = "✓ Achievement Verified";

      button.style.color = "#4ade80";
      button.style.borderColor = "rgba(34,197,94,.3)";

      setTimeout(function () {
        button.textContent = "View Achievement";
      }, 1800);

    });

  });


  // ----------------------------------------------------------
  // CI PIPELINE SIMULATION
  // ----------------------------------------------------------

  const runPipeline = document.getElementById("runPipeline");
  const consoleBox = document.getElementById("pipelineConsole");

  if (runPipeline && consoleBox) {

    const stages = document.querySelectorAll(".interactive-stage");

    runPipeline.addEventListener("click", function () {

      runPipeline.disabled = true;
      runPipeline.textContent = "Pipeline Running...";

      stages.forEach(function (stage) {
        stage.classList.remove("active");
      });

      let current = 0;

      const messages = [
        "Cloning repository from GitHub...",
        "Installing Node.js dependencies...",
        "Building application...",
        "Running application tests...",
        "Packaging deployment artifact...",
        "CI pipeline completed successfully."
      ];

      function nextStage() {

        if (current < stages.length) {

          stages[current].classList.add("active");

          consoleBox.innerHTML =
            '<span class="console-prompt">></span>' +
            messages[current];

          current++;

          setTimeout(nextStage, 900);

        } else {

          runPipeline.textContent = "✓ CI Pipeline Complete";

          consoleBox.innerHTML =
            '<span class="console-prompt">></span>' +
            '<strong> SUCCESS:</strong> Artifact ready for CD deployment.';

        }

      }

      nextStage();

    });

  }


  // ----------------------------------------------------------
  // PRICING DEMO
  // ----------------------------------------------------------

  document.querySelectorAll(".pricing-button").forEach(function (button) {

    button.addEventListener("click", function () {

      const original = button.textContent;

      button.textContent = "✓ Demo Selected";

      setTimeout(function () {
        button.textContent = original;
      }, 1800);

    });

  });

})();
