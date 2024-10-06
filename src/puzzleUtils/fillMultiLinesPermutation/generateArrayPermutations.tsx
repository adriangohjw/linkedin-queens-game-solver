const generateArrayPermutations = ({
  arr,
  N,
}: {
  arr: number[];
  N: number;
}): number[][] => {
  const result: number[][] = [];

  function helper(start: number, currentCombination: number[]) {
    if (currentCombination.length === N) {
      result.push([...currentCombination]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      currentCombination.push(arr[i]);
      helper(i + 1, currentCombination);
      currentCombination.pop();
    }
  }

  helper(0, []);
  return result;
};

export default generateArrayPermutations;
