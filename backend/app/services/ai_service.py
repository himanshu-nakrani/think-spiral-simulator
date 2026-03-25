import uuid
from typing import List, Tuple
from transformers import pipeline
import json


class AIService:
    """Singleton service for AI operations using HuggingFace transformers."""

    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            print("[AI Service] Initializing HuggingFace pipelines...")
            try:
                # Initialize zero-shot classification for emotion detection
                self.classifier = pipeline(
                    "zero-shot-classification",
                    model="facebook/bart-large-mnli",
                )

                # Initialize text generation for expanding thoughts
                self.generator = pipeline(
                    "text-generation",
                    model="gpt2",
                    truncation=True,
                )

                self._initialized = True
                print("[AI Service] Pipelines initialized successfully")
            except Exception as e:
                print(f"[AI Service] Warning: Could not load models: {e}")
                self.classifier = None
                self.generator = None
                self._initialized = True

    def generate_spiral(
        self, initial_thought: str, mode: str
    ) -> Tuple[List[dict], List[float]]:
        """
        Generate a spiral of thoughts based on initial thought and mode.

        Returns:
            Tuple of (thoughts, emotion_scores)
        """
        thoughts = []
        emotion_scores = []

        # Predefined spiral patterns based on mode
        if mode == "anxious":
            patterns = [
                f"What if {initial_thought}?",
                "And then everything would go wrong because...",
                "That would mean I'm a failure and everyone would know",
                "I'd never recover from that embarrassment",
                "My entire life would be ruined forever",
            ]
            base_emotions = [40, 55, 70, 85, 95]

        elif mode == "logical":
            patterns = [
                f"Analyzing: {initial_thought}",
                "Breaking down all possible outcomes systematically...",
                "Considering worst-case probability distributions",
                "If X happens, then Y must follow mathematically",
                "Therefore, the only conclusion is maximum catastrophe",
            ]
            base_emotions = [35, 50, 65, 78, 90]

        else:  # dramatic
            patterns = [
                f"OH NO! {initial_thought}?!",
                "This is absolutely THE WORST that could happen!",
                "EVERYONE will judge me FOREVER for this!",
                "My ENTIRE EXISTENCE is now MEANINGLESS!",
                "THE END IS HERE! EVERYTHING IS LOST!",
            ]
            base_emotions = [50, 70, 85, 95, 100]

        # Create thoughts with emotion scores
        for i, pattern in enumerate(patterns):
            thought_id = str(uuid.uuid4())
            emotion_score = base_emotions[i]

            # Add slight variation based on mode
            if mode == "anxious":
                emotion_score += (i * 3)
            elif mode == "logical":
                emotion_score += (i * 2)
            else:
                emotion_score += (i * 1.5)

            thoughts.append(
                {
                    "id": thought_id,
                    "text": pattern,
                    "emotionScore": min(100, emotion_score),
                    "level": i + 1,
                }
            )
            emotion_scores.append(min(100, emotion_score))

        return thoughts, emotion_scores

    def generate_reality_check(
        self, initial_thought: str, thoughts: List[dict], mode: str
    ) -> Tuple[str, List[str]]:
        """
        Generate a reality check and insights based on the spiral.

        Returns:
            Tuple of (reality_check_text, insights_list)
        """

        # Predefined reality checks based on mode
        if mode == "anxious":
            reality_check = (
                f"While '{initial_thought}' feels concerning, remember that anxiety often "
                "amplifies perceived threats. Most of what we worry about never happens. "
                "You've overcome challenges before. Taking small, concrete steps is more effective "
                "than catastrophizing about outcomes."
            )
            insights = [
                "Anxiety creates false narratives - challenge the evidence",
                "You have coping skills you've used successfully in the past",
                "Breaking the problem into smaller steps reduces overwhelm",
                "Progress, not perfection, is the goal",
            ]

        elif mode == "logical":
            reality_check = (
                f"While analyzing '{initial_thought}' thoroughly is good, over-analysis can lead to "
                "decision paralysis. Not every outcome is equally probable. The most likely scenario "
                "is often mundane, not catastrophic. Facts matter, but so does accepting uncertainty."
            )
            insights = [
                "Seek evidence before assuming worst-case probability",
                "Recognize that not everything requires perfect analysis",
                "Some things are unknowable - that's acceptable",
                "Decision-making requires balancing analysis with action",
            ]

        else:  # dramatic
            reality_check = (
                f"While '{initial_thought}' feels HUGE right now, perspective and time reveal that "
                "most situations are temporary. Your reactions feel enormous in the moment but settle "
                "with distance. You're stronger and more resilient than this spiral suggests."
            )
            insights = [
                "Strong emotions feel permanent but they always pass",
                "What seems catastrophic now will likely feel manageable soon",
                "You've handled difficult moments before",
                "Self-compassion is more useful than self-criticism right now",
            ]

        return reality_check, insights

    def classify_emotion(self, text: str) -> float:
        """
        Classify emotion intensity of text using zero-shot classification.
        Returns a score from 0-100.
        """
        if self.classifier is None:
            return 50.0

        try:
            candidate_labels = [
                "calm and peaceful",
                "slightly concerned",
                "worried",
                "very anxious",
                "panicked",
            ]
            result = self.classifier(text, candidate_labels)

            # Map labels to scores
            label_to_score = {
                "calm and peaceful": 20,
                "slightly concerned": 40,
                "worried": 60,
                "very anxious": 80,
                "panicked": 100,
            }

            top_label = result["labels"][0]
            return label_to_score.get(top_label, 50.0)
        except Exception as e:
            print(f"[AI Service] Error classifying emotion: {e}")
            return 50.0
