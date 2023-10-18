export const useWindowHandle = () => {
  let isOpenWindow = ref(false);
  const switchWindow = () => {
    isOpenWindow.value = !isOpenWindow.value;
  };
  return { isOpenWindow, switchWindow };
};
