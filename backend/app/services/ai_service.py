import json
import os
import uuid
from typing import List, Tuple

import google.generativeai as genai


class AIService:
    """Singleton service for AI operations using Gemini with graceful fallback."""

    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AIService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not self._initialized:
            print("[AI Service] Initializing Gemini client...")
            try:
                api_key = os.getenv("GEMINI_API_KEY")
                if api_key:
                    genai.configure(api_key=api_key)
                    # Free-tier friendly default model.
                    self.model = genai.GenerativeModel("models/gemini-2.5-flash-lite")
                    self.gemini_enabled = True
                    print("[AI Service] Gemini model initialized successfully")
                else:
                    self.model = None
                    self.gemini_enabled = False
                    print("[AI Service] GEMINI_API_KEY not set; using fallback patterns")

                self._initialized = True
            except Exception as e:
                print(f"[AI Service] Warning: Could not initialize Gemini: {e}")
                self.model = None
                self.gemini_enabled = False
                self._initialized = True

    def generate_spiral(
        self, initial_thought: str, mode: str
    ) -> Tuple[List[dict], List[float]]:
        """
        Generate a spiral of thoughts based on initial thought and mode.

        Returns:
            Tuple of (thoughts, emotion_scores)
        """
        if self.gemini_enabled:
            gemini_result = self._generate_spiral_with_gemini(initial_thought, mode)
            if gemini_result is not None:
                return gemini_result

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
        if self.gemini_enabled:
            gemini_result = self._generate_reality_check_with_gemini(
                initial_thought, thoughts, mode
            )
            if gemini_result is not None:
                return gemini_result

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
        """Fallback score classifier based on simple signal words (0-100)."""
        text_lower = text.lower()
        high_intensity_terms = ["ruined", "catastrophe", "panic", "worst", "lost"]
        medium_intensity_terms = ["worried", "concerned", "embarrassed", "anxious"]

        if any(term in text_lower for term in high_intensity_terms):
            return 85.0
        if any(term in text_lower for term in medium_intensity_terms):
            return 65.0
        return 50.0

    def generate_break_spiral(
        self, initial_thought: str, thoughts: List[dict], mode: str
    ) -> List[dict]:
        if self.gemini_enabled:
            gemini_result = self._generate_break_spiral_with_gemini(
                initial_thought, thoughts, mode
            )
            if gemini_result is not None:
                return gemini_result

        # Fallback CBT-style reframes.
        reframes = []
        for thought in thoughts[:5]:
            text = thought.get("text", "")
            reframes.append(
                {
                    "thought": text,
                    "rationalCounter": "Pause and check evidence: this is one moment, not your full story. A small next step is enough.",
                }
            )
        return reframes

    def _extract_json_payload(self, raw_text: str):
        text = raw_text.strip()
        if text.startswith("```"):
            text = text.replace("```json", "").replace("```", "").strip()

        start = text.find("{")
        end = text.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return None

        candidate = text[start : end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            return None

    def _generate_spiral_with_gemini(
        self, initial_thought: str, mode: str
    ) -> Tuple[List[dict], List[float]] | None:
        try:
            prompt = f"""
You are generating a thought spiral simulation.
Return ONLY valid JSON in this exact shape:
{{
  "thoughts": [
    {{"text": "string", "emotionScore": number}}
  ]
}}

Rules:
- Generate exactly 5 thoughts.
- Mode is "{mode}" and initial thought is "{initial_thought}".
- Each thought should escalate intensity naturally.
- emotionScore must be numeric from 0 to 100 and generally increase.
- Keep each thought concise (max ~18 words).
"""
            response = self.model.generate_content(prompt)
            data = self._extract_json_payload(response.text if response else "")
            if not data or "thoughts" not in data:
                return None

            raw_thoughts = data["thoughts"][:5]
            if len(raw_thoughts) < 5:
                return None

            thoughts = []
            emotion_scores = []
            for idx, item in enumerate(raw_thoughts):
                text = str(item.get("text", "")).strip()
                score = float(item.get("emotionScore", 50))
                bounded_score = max(0.0, min(100.0, score))
                if not text:
                    return None
                thoughts.append(
                    {
                        "id": str(uuid.uuid4()),
                        "text": text,
                        "emotionScore": bounded_score,
                        "level": idx + 1,
                    }
                )
                emotion_scores.append(bounded_score)

            return thoughts, emotion_scores
        except Exception as e:
            print(f"[AI Service] Gemini spiral generation failed: {e}")
            return None

    def _generate_reality_check_with_gemini(
        self, initial_thought: str, thoughts: List[dict], mode: str
    ) -> Tuple[str, List[str]] | None:
        try:
            thought_text = [t.get("text", "") for t in thoughts]
            prompt = f"""
You are generating a grounded, supportive reality check.
Return ONLY valid JSON in this exact shape:
{{
  "realityCheck": "string",
  "insights": ["string", "string", "string", "string"]
}}

Context:
- Initial thought: "{initial_thought}"
- Mode: "{mode}"
- Spiral thoughts: {json.dumps(thought_text)}

Rules:
- Keep realityCheck practical and reassuring (2-4 sentences).
- Provide exactly 4 concise, actionable insights.
- No markdown.
"""
            response = self.model.generate_content(prompt)
            data = self._extract_json_payload(response.text if response else "")
            if not data:
                return None

            reality_check = str(data.get("realityCheck", "")).strip()
            insights = data.get("insights", [])
            if not reality_check or not isinstance(insights, list) or len(insights) < 4:
                return None

            cleaned_insights = [str(item).strip() for item in insights[:4] if str(item).strip()]
            if len(cleaned_insights) < 4:
                return None

            return reality_check, cleaned_insights
        except Exception as e:
            print(f"[AI Service] Gemini reality check generation failed: {e}")
            return None

    def _generate_break_spiral_with_gemini(
        self, initial_thought: str, thoughts: List[dict], mode: str
    ) -> List[dict] | None:
        try:
            thought_text = [t.get("text", "") for t in thoughts][:5]
            prompt = f"""
You are a CBT coach. Reframe each distorted thought.
Return ONLY valid JSON in this exact shape:
{{
  "reframes": [
    {{
      "thought": "string",
      "rationalCounter": "string"
    }}
  ]
}}

Context:
- Initial thought: "{initial_thought}"
- Mode: "{mode}"
- Spiral thoughts: {json.dumps(thought_text)}

Rules:
- Return 5 reframes matching the thought list order.
- rationalCounter should be concise, compassionate, practical.
- No markdown.
"""
            response = self.model.generate_content(prompt)
            data = self._extract_json_payload(response.text if response else "")
            if not data or "reframes" not in data:
                return None

            reframes = []
            for item in data["reframes"][:5]:
                thought = str(item.get("thought", "")).strip()
                counter = str(item.get("rationalCounter", "")).strip()
                if thought and counter:
                    reframes.append({"thought": thought, "rationalCounter": counter})

            if len(reframes) < 3:
                return None
            return reframes
        except Exception as e:
            print(f"[AI Service] Gemini break-spiral generation failed: {e}")
            return None
