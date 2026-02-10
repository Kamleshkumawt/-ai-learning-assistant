import FlashcardModel from "../models/flashcard.model.js";

//@desc Get All flashcard for a document
//@route GET /flashcard/:documentId
//@access Private
export const getFlashcards = async (req, res, next) => {
  try {
    const flashcards = await FlashcardModel.find({
      userId: req.user.id,
      documentId: req.params.documentId,
    })
      .populate("documentId", "title fileName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcards.length,
      data: flashcards,
    });
  } catch (error) {
    next(error);
  }
};

//@desc Get All flashcard for a document
//@route GET /flashcard
//@access Private
export const getAllFlashcards = async (req, res, next) => {
  try {
    const flashcardSets = await FlashcardModel.find({
      userId: req.user.id,
    })
      .populate("documentId", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flashcardSets.length,
      data: flashcardSets,
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Mark flashcard as reviewed
//@route    GET /flashcard/:id/review
//@access   Private

export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcardSets = await FlashcardModel.findOne({
        'cards._id': req.params.cardId,
        userId: req.user.id,
    });

    if(!flashcardSets) {
        return res.status(404).json({
            success: false,
            error: "Flashcard set or card not found",
            statusCode: 404,
        });
    }

    const cardIndex = flashcardSets.cards.findIndex(card => card._id.toString() === req.params.cardId);

    if(cardIndex === -1) {
        return res.status(404).json({
            success: false,
            error: "card not found in set",
            statusCode: 404,
        });
    }

    //Update review info
    flashcardSets.cards[cardIndex].lastReviewed = new Date();
    flashcardSets.cards[cardIndex].reviewCount += 1;

    await flashcardSets.save();

    res.status(200).json({
        success: true,
        data: flashcardSets,
        message: "Flashcard reviewed successfully",
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Toggle star/favorite on flashcard
//@route    PUT /flashcard/:id/star
//@access   Private

export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await FlashcardModel.findOne({
        'cards._id': req.params.cardId,
        userId: req.user.id,
    });

    if(!flashcardSet) {
        return res.status(404).json({
            success: false,
            error: "Flashcard set or card not found",
            statusCode: 404,
        });
    }

    const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

    if(cardIndex === -1) {
        return res.status(404).json({
            success: false,
            error: "card not found in set",
            statusCode: 404,
        });
    }

    //Toggle star
    flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;

    await flashcardSet.save();

    res.status(200).json({
        success: true,
        data: flashcardSet,
        message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? "starred" : "unstarred"} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

//@desc     Delete flashcard
//@route    DELETE /flashcard/:id
//@access   Private

export const deleteFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await FlashcardModel.findOne({
        _id: req.params.id,
        userId: req.user.id,
    });

    if(!flashcardSet) {
        return res.status(404).json({
            success: false,
            error: "Flashcard set not found",
            statusCode: 404,
        });
    }

    //Delete flashcard from database
    await flashcardSet.deleteOne();

    res.status(200).json({
        success: true,
        message: "Flashcard deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
