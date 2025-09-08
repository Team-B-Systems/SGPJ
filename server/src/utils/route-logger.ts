import express from "express";
import chalk from "chalk";
import Table from "cli-table3";

function printRoutes(app: express.Express) {
  const table = new Table({
    head: [chalk.cyan("Method"), chalk.cyan("Path")],
    colWidths: [15, 50],
    style: { head: [], border: [] },
  });

  function dig(stack: any[], prefix = "") {
    stack.forEach((layer) => {
      if (layer.route) {
        // Rotas diretas
        const path = prefix + layer.route.path;
        const methods = Object.keys(layer.route.methods);
        methods.forEach((m) => {
          const color =
            m === "get"
              ? chalk.blue
              : m === "post"
              ? chalk.green
              : m === "put"
              ? chalk.yellow
              : m === "delete"
              ? chalk.red
              : chalk.white;
          table.push([color(m.toUpperCase()), path]);
        });
      } else if (layer.name === "router") {
        // Sub-routers
        const newPrefix =
          prefix + (layer.regexp.source
            .replace("^\\", "")
            .replace("\\/?(?=\\/|$)", "")
            .replace("\\/", "/")
            .replace("(?=\\/|$)", ""));
        const path = newPrefix + layer.route.path;
        const methods = Object.keys(layer.route.methods);
        methods.forEach((m) => {
          const color =
            m === "get"
              ? chalk.blue
              : m === "post"
              ? chalk.green
              : m === "put"
              ? chalk.yellow
              : m === "delete"
              ? chalk.red
              : chalk.white;
          table.push([color(m.toUpperCase()), path]);
        });
      }
    });
  }
  dig(app.router.stack);
  console.log(table.toString());
}

export { printRoutes };
