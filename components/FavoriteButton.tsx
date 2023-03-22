import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";

import React, { useCallback, useMemo } from "react";
import useFavorites from "@/hooks/useFavorites";
import useCurrentUser from "@/hooks/useCurrentUser";
import axios from "axios";

interface FavoriteButtonProps {
	movieId: string;
}
const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {
	const { mutate: mutateFavorites } = useFavorites();
	const { data: currentUser, mutate } = useCurrentUser();

	const isFavorite = useMemo(() => {
		const list = currentUser?.favoriteIds || [];

		return list.includes(movieId);
	}, [currentUser, movieId]);

	const toggleFavorites = useCallback(async () => {
		let response;
		if (isFavorite) {
			response = await axios.delete("/api/favorite", { data: { movieId } });
		} else{
			response = await axios.post('/api/favorite', {movieId})
		}

		const updatedFavoriteIds = response?.data?.favoriteIds;

		mutate({
			...currentUser,
			favoriteIds: updatedFavoriteIds
		});

		mutateFavorites();
	}, [movieId, isFavorite, currentUser, mutate, mutateFavorites ]);

	const IconName = isFavorite ? AiTwotoneHeart : AiOutlineHeart;
	return (
		<div 
		onClick={toggleFavorites}
		className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10  flex justify-center items-center transition">
			<IconName className="text-white hover:text-red-500" size={30} />
		</div>
	);
};

export default FavoriteButton;
