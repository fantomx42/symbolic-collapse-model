import unittest
import torch
from scm_engine.scm_engine import SCMEngine

class TestSCMEngine(unittest.TestCase):

    def setUp(self):
        """Set up a new SCMEngine instance before each test."""
        self.engine = SCMEngine(context_window_size=10, gist_update_rate=0.1, decay_rate=0.9)

    def test_initialization(self):
        """Test that the engine initializes with the correct parameters."""
        self.assertEqual(self.engine.context_window_size, 10)
        self.assertEqual(self.engine.gist_update_rate, 0.1)
        self.assertEqual(self.engine.decay_rate, 0.9)
        self.assertTrue(torch.equal(self.engine.active_memory, torch.zeros(10, 5)))
        self.assertTrue(torch.equal(self.engine.gist_layer, torch.zeros(5)))
        self.assertEqual(self.engine.recall_pool, [])

    def test_score_token(self):
        """Test the mock score_token method."""
        scores = self.engine.score_token("test", [])
        self.assertEqual(scores.shape, (5,))
        self.assertTrue(all(0 <= s <= 1 for s in scores))

    def test_update_gist(self):
        """Test that the gist layer is updated correctly."""
        initial_gist = self.engine.gist_layer.clone()
        symbolic_state = torch.tensor([0.1, 0.2, 0.3, 0.4, 0.5])
        self.engine.update_gist(symbolic_state)

        expected_gist = (1 - 0.1) * initial_gist + 0.1 * symbolic_state
        self.assertTrue(torch.allclose(self.engine.gist_layer, expected_gist))

    def test_add_memory_node(self):
        """Test that memory nodes are added to the recall pool."""
        self.assertEqual(len(self.engine.recall_pool), 0)
        symbolic_state = torch.tensor([0.5, 0.5, 0.5, 0.5, 0.5])
        self.engine.add_memory_node("test_event", "test_snippet", symbolic_state)

        self.assertEqual(len(self.engine.recall_pool), 1)
        node = self.engine.recall_pool[0]
        self.assertEqual(node['event_type'], "test_event")
        self.assertEqual(node['snippet'], "test_snippet")
        self.assertTrue(torch.equal(node['symbolic_state'], symbolic_state))

    def test_decay_context(self):
        """Test that the active memory decays correctly."""
        self.engine.active_memory = torch.ones(10, 5)
        self.engine.decay_context()
        expected_memory = torch.full((10, 5), 0.9)
        self.assertTrue(torch.allclose(self.engine.active_memory, expected_memory))

    def test_filter_tokens(self):
        """Test the mock filter_tokens method."""
        candidate_tokens = ["a", "b", "c"]
        filtered = self.engine.filter_tokens(candidate_tokens)
        self.assertEqual(filtered, candidate_tokens)

    def test_get_state(self):
        """Test that get_state returns the correct current state."""
        state = self.engine.get_state()
        self.assertTrue(torch.equal(state['active_memory'], self.engine.active_memory))
        self.assertTrue(torch.equal(state['gist_layer'], self.engine.gist_layer))
        self.assertEqual(state['recall_pool'], self.engine.recall_pool)

if __name__ == '__main__':
    unittest.main()
