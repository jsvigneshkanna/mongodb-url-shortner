// $(document).ready(function () {
//   //   $("#submit").click(function () {
//   //     $.post(
//   //       "/delete",
//   //       {
//   //         name: "viSion",
//   //         designation: "Professional gamer",
//   //       },
//   //       function (data, status) {
//   //         console.log(data);
//   //       }
//   //     );
//   //   });
//   console.log("document loaded");
// });

const deleteBtns = document.querySelectorAll(".material-icons.delete");
deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", () => {
    const shortUrl = deleteBtn.id;
    $.post(
      "/delete",
      {
        shorturl: shortUrl,
      },
      function (data, status) {
        console.log(data);
      }
    );
  });
});
