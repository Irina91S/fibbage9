export default function useCurrentPlayer() {
  return JSON.parse(localStorage.getItem('playerInfo'));
}