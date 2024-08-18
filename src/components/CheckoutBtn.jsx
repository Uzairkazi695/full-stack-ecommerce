import { Button } from "./ui/button";

function CheckoutBtn({ products, cartItems }) {
  const order = () => {
    console.log(cartItems);

    fetch("https://paymentserver-vs9diykg.b4a.run/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cartItems,
      }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ url }) => {
        window.location = url;
      })
      .catch((e) => {
        console.error(e.error);
      });
  };
  return (
    <Button
      className="w-32 h-10 rounded-full flex justify-center items-center"
      onClick={order}
    >
      Checkout
    </Button>
  );
}

export default CheckoutBtn;
