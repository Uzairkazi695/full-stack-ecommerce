const useLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export default useLocalStorage;
